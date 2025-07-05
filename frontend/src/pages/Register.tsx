import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <form onSubmit={handleSubmit}>
      <h2>Registrieren</h2>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit">Registrieren</button>
      <div>
        <a href="/login">Bereits registriert? Login</a>
      </div>
    </form>
  );
};

export default Register;