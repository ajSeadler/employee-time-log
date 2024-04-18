import React, { useEffect, useState } from "react";
import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import EmployeeStats from "./EmployeeStats";
import EmployeeStatsChart from "./EmployeeStatsChart";
import TimeStampChart from "./TimeStampChart";

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
    return <CircularProgress style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-content" style={{padding:'30px'}}>
        <Card variant="outlined" style={{ backgroundColor: "#292929", margin: "0px", padding: "20px"}}>
          <CardContent>
            <Typography variant="h4" gutterBottom style={{color:'#fff', fontWeight:'bold'}}>
              Welcome, <span style={{color:'#ffd166', fontWeight:'bolder'}}>{userData?.name}!</span>
            </Typography>
            {/* {userData && (
              <div>
                <Typography variant="body1" gutterBottom style={{fontWeight:'bolder'}}>
                  Email: {userData.email}
                </Typography>
              </div>
              
            )} */}
            <div>
            <Typography variant="h5" gutterBottom style={{fontWeight:'bolder', color:'#fff'}}>
                  <span>Employee Dashboard</span>
                </Typography>
              </div>
            <EmployeeStats userData={userData} />
          </CardContent>
          <EmployeeStatsChart userData={userData} />
        </Card>
      </div>
      
    </div>
  );
};

export default ProfilePage;
