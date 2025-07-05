import React, { useState } from "react";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const RequestPasswordReset: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const csrfToken = getCookie("csrfToken");
      const res = await fetch("/api/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken || ""
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Falls die E-Mail existiert, wurde ein Link gesendet.");
        setEmail("");
      } else {
        setMessage(data.error || "Fehler beim Anfordern des Links");
      }
    } catch (err) {
      setMessage("Serverfehler");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md flex flex-col gap-4 border border-teal-700 mx-auto mt-20"
      >
        <h2 className="text-2xl font-bold text-teal-300 text-center mb-2">
          Passwort zurücksetzen
        </h2>
        {message && (
          <div className="text-green-400 text-center">{message}</div>
        )}
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 rounded bg-gray-900 text-teal-200 border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="mt-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 rounded transition-colors shadow"
        >
          Link anfordern
        </button>
      </form>
    </div>
  );
};

export default RequestPasswordReset;