import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="profile-page container">
      <div className="card mb-3">
        <div className="card-body">
          <h1 className="card-title mb-4 fade-in">Welcome, {userData?.name}!</h1>
          {userData && (
            <div>
              <p className="card-text">
                Email: {userData.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
