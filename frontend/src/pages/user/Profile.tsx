import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

type Profile = {
  id: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          setProfile(data);
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            avatarUrl: data.avatarUrl || "",
            bio: data.bio || ""
          });
        } else setError("Nicht eingeloggt oder Token ungültig.");
        setLoading(false);
      })
      .catch(() => {
        setError("Fehler beim Laden des Profils.");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      const csrfToken = getCookie("csrfToken");
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Profil aktualisiert.");
        setProfile(data);
      } else {
        setError(data.error || "Fehler beim Speichern.");
      }
    } catch (err) {
      setError("Serverfehler");
    }
  };

  if (loading) return <div className="text-teal-200 text-center mt-10">Lädt...</div>;
  if (error) return <div className="text-red-400 text-center mt-10">{error}</div>;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md flex flex-col gap-4 border border-teal-700 mx-auto mt-20"
      >
        <h2 className="text-2xl font-bold text-teal-300 text-center mb-2">Profil</h2>
        {success && <div className="text-green-400 text-center">{success}</div>}
        <input
          type="text"
          name="firstName"
          placeholder="Vorname"
          value={form.firstName || ""}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-900 text-teal-200 border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-gray-400"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Nachname"
          value={form.lastName || ""}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-900 text-teal-200 border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-gray-400"
        />
        <input
          type="text"
          name="avatarUrl"
          placeholder="Avatar URL"
          value={form.avatarUrl || ""}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-900 text-teal-200 border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-gray-400"
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio || ""}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-900 text-teal-200 border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="mt-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 rounded transition-colors shadow"
        >
          Speichern
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 rounded transition-colors shadow mt-2"
        >
          Logout
        </button>
      </form>
    </div>
  );
};

export default Profile;