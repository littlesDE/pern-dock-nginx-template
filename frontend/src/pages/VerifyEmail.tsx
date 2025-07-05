import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState<string>("Bitte warten...");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Kein Token angegeben.");
      return;
    }
    fetch(`/api/verify-email?token=${token}`)
      .then(res => res.json())
      .then(data => setMessage(data.message || data.error))
      .catch(() => setMessage("Fehler bei der Verifizierung."));
  }, [token]);

  return (
    <div>
      <h2>E-Mail Verifizierung</h2>
      <p>{message}</p>
      <Link to="/login">Zum Login</Link>
    </div>
  );
};

export default VerifyEmail;