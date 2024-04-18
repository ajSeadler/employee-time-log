import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const EmployeeStatsChart = ({ userData }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeStats = async () => {
      try {
        const userId = userData ? userData.id : null;
        if (!userId) {
          throw new Error("User ID not found");
        }
        const response = await fetch(`/api/stats/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch employee stats");
        }
        const statsData = await response.json();
        setStats(statsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeStats();
  }, [userData]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Define the maximum work hours in a week and month
  const maxWeeklyHours = 40; // Assuming 40 hours is standard
  const maxMonthlyHours = 160; // Assuming 160 hours is standard

  // Extracting the values from the first item of the stats array
  const { weekly_hours, monthly_hours, hourly_wage } = stats[0];

  // Adjusting the values if they exceed the maximum expected hours
  const adjustedWeeklyHours = weekly_hours > maxWeeklyHours ? maxWeeklyHours : weekly_hours;
  const adjustedMonthlyHours = monthly_hours > maxMonthlyHours ? maxMonthlyHours : monthly_hours;

  return (
    <div className="stats-container">
      <div className="stat-item">
        <h3 style={{marginBottom:'10px', color:'#fff'}}>Weekly Hours</h3>
        <CircularProgressbar
          value={adjustedWeeklyHours}
          text={`${adjustedWeeklyHours}/40`}
          maxValue={maxWeeklyHours}
          styles={{
            // Customize the root svg element
            root: {},
            // Customize the path, i.e., the progress bar itself
            path: { stroke: "#00cc66" },
            // Customize the trail, i.e., the background of the progress bar
            trail: { stroke: "#fff" },
            // Customize the text
            text: { fill: "#00cc66", fontSize: "20px" } // Adjust fontSize as needed
          }}
        />
      </div>
      <div className="stat-item">
        <h3 style={{marginBottom:'10px', color:'#fff'}}>Monthly Hours</h3>
        <CircularProgressbar
          value={adjustedMonthlyHours}
          text={`${adjustedMonthlyHours}/160`}
          maxValue={maxMonthlyHours}
          styles={{
            // Customize the root svg element
            root: {},
            // Customize the path, i.e., the progress bar itself
            path: { stroke: "#00cc66" },
            // Customize the trail, i.e., the background of the progress bar
            trail: { stroke: "#fff" },
            // Customize the text
            text: { fill: "#00cc66", fontSize: "20px" } // Adjust fontSize as needed
          }}
        />
      </div>
      {/* Repeat for other stats */}
    </div>
  );
};

export default EmployeeStatsChart;
