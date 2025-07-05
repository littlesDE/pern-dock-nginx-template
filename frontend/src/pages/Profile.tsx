import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  email: string;
  createdAt: string;
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) setUser(data);
        else setError("Nicht eingeloggt oder Token ungültig.");
      })
      .catch(() => setError("Fehler beim Laden des Profils."));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error) return <div>{error}</div>;
  if (!user) return <div>Lade Profil...</div>;

  return (
    <div>
      <h2>Profil</h2>
      <p>ID: {user.id}</p>
      <p>E-Mail: {user.email}</p>
      <p>Registriert am: {new Date(user.createdAt).toLocaleString()}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;