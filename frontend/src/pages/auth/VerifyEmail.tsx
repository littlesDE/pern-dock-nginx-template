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
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md flex flex-col gap-4 border border-teal-700 mx-auto mt-20">
        <h2 className="text-2xl font-bold text-teal-300 text-center mb-2">E-Mail bestätigen</h2>
        <p className="text-teal-200 text-center">{message}</p>
        <Link to="/login" className="text-teal-400 hover:underline text-center">Zum Login</Link>
      </div>
    </div>
  );
};

export default VerifyEmail;