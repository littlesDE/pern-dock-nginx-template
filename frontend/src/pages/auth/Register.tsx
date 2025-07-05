import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const csrfToken = getCookie("csrfToken");
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken || ""
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registrierung erfolgreich! Bitte E-Mail bestätigen.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Registrierung fehlgeschlagen");
      }
    } catch (err) {
      setError("Serverfehler");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md flex flex-col gap-4 border border-teal-700"
      >
        <h2 className="text-2xl font-bold text-teal-300 text-center mb-2">
          Registrieren
        </h2>
        {message && (
          <div className="text-green-400 text-center">{message}</div>
        )}
        {error && <div className="text-red-400 text-center">{error}</div>}
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 rounded bg-gray-900 text-teal-200 border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-gray-400"
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-2 rounded bg-gray-900 text-teal-200 border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="mt-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 rounded transition-colors shadow"
        >
          Registrieren
        </button>
        <div className="flex justify-between text-sm mt-2 text-teal-200">
          <a href="/login" className="hover:underline">Login</a>
        </div>
      </form>
    </div>
  );
};

export default Register;