import React, { useState } from "react";

const RequestPasswordReset: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    await fetch("/api/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMessage("Falls die E-Mail existiert, wurde ein Link gesendet.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Passwort vergessen?</h2>
      {message && <div style={{ color: "green" }}>{message}</div>}
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      /><br />
      <button type="submit">Reset-Link anfordern</button>
    </form>
  );
};

export default RequestPasswordReset;