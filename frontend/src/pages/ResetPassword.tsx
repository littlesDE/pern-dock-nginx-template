import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

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
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Passwort erfolgreich geändert!");
    } else {
      setError(data.error || "Fehler beim Zurücksetzen.");
    }
  };

  if (!token) return <div>Kein Token angegeben.</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Neues Passwort setzen</h2>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <input
        type="password"
        placeholder="Neues Passwort"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
      /><br />
      <button type="submit">Passwort ändern</button>
      <div>
        <Link to="/login">Zum Login</Link>
      </div>
    </form>
  );
};

export default ResetPassword;