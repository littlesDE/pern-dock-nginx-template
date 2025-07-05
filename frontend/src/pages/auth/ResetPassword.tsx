import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const csrfToken = getCookie("csrfToken");
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken || ""
        },
        credentials: "include",
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Passwort erfolgreich geändert!");
        setNewPassword("");
      } else {
        setError(data.error || "Fehler beim Zurücksetzen.");
      }
    } catch (err) {
      setError("Serverfehler");
    }
  };

  if (!token)
    return <div className="text-red-400 text-center mt-10">Kein Token angegeben.</div>;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md flex flex-col gap-4 border border-teal-700 mx-auto mt-20"
      >
        <h2 className="text-2xl font-bold text-teal-300 text-center mb-2">Neues Passwort setzen</h2>
        {message && <div className="text-green-400 text-center">{message}</div>}
        {error && <div className="text-red-400 text-center">{error}</div>}
        <input
          type="password"
          placeholder="Neues Passwort"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          className="px-4 py-2 rounded bg-gray-900 text-teal-200 border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="mt-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 rounded transition-colors shadow"
        >
          Passwort speichern
        </button>
        <div className="flex justify-between text-sm mt-2 text-teal-200">
          <Link to="/login" className="hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;