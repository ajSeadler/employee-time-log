import React, { useEffect, useState } from "react";
import { Card, CardContent, CircularProgress, Typography } from "@mui/material";

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
    return <CircularProgress />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          Welcome, {userData?.name}!
        </Typography>
        {userData && (
          <div>
            <Typography variant="body1" gutterBottom>
              Email: {userData.email}
            </Typography>
          </div>
        )}
        <div className="stats-container">
          <div className="week-hours">
            <h3>Weekly Hours</h3>
          </div>
          <div className="month-hours">
            <h3>Monthly Hours</h3>
          </div>
          <div className="expected-salary">
            <h3>Expected Salary</h3>
          </div>
          <div className="ytd-earnings">
            <h3>Earnings So Far</h3>
          </div>
          
          <div className="pto">
            <h3>Paid Time Off</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;
