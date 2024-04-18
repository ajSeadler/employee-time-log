import React, {useState, useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout"
import UpdateStatsForm from "./components/UpdateStatsForm";
import TimeStampChart from "./components/TimeStampChart";
import { CircularProgress } from "@mui/material";
import Settings from "./components/Settings";
import SignUp from "./components/SignUp";

function App() {
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
    <>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/me" element={<Layout />} />
          <Route path="/addhours" element={<UpdateStatsForm />} />
          <Route path="/trackpay" element={<TimeStampChart userData={userData}/>} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
