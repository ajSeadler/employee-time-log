import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import {
  FaHourglassHalf,
  FaMoneyBillAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaMoneyCheck,
} from "react-icons/fa";

const EmployeeStats = ({ userData }) => {
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

  const calculateOvertimeHours = (hours) => {
    const overtimeHours = Math.max(hours - 40, 0);
    return overtimeHours > 0 ? `+${overtimeHours}OT` : "";
  };

  return (
    <div className="stats-container">
      {stats && (
        <div className="grid-container">
          <div className="grid-item">
            <Card className="stat-card">
            <CardContent>
                <FaHourglassHalf className="icon" style={{ color: "salmon" }} />
                <Typography variant="h6">Weekly Hours</Typography>
                <Typography variant="body2" className="value">
                  {stats[0].weekly_hours > 40 ? 40 : stats[0].weekly_hours}
                  <div style={{color:'red'}}>{calculateOvertimeHours(stats[0].weekly_hours)}</div>
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="grid-item">
            <Card className="stat-card">
              <CardContent>
                <FaHourglassHalf className="icon" style={{ color: "salmon" }} />
                <Typography variant="h6">Monthly Hours</Typography>
                <Typography variant="body2" className="value">
                  {stats[0].monthly_hours}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="grid-item">
            <Card className="stat-card">
              <CardContent>
                <FaCalendarAlt className="icon" style={{ color: "salmon" }} />
                <Typography variant="h6">Paid Time Off</Typography>
                <Typography variant="body2" className="value">
                  {stats[0].paid_time_off} days
                </Typography>
              </CardContent>
            </Card>
          </div>

          <div className="grid-item">
            <Card className="stat-card">
              <CardContent>
                <FaMoneyBillAlt className="icon" style={{ color: "green" }} />
                <Typography variant="h6">
                  Previous Shift's Earnings{" "}
                </Typography>
                <Typography variant="body2" className="value">
                  ${stats[0].earnings_so_far}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="grid-item">
            <Card className="stat-card">
              <CardContent>
                <FaDollarSign className="icon" style={{ color: "green" }} />
                <Typography variant="h6">
                  Expected Salary{" "}
                  <span style={{ color: "grey" }}>(This Month)</span>
                </Typography>
                <Typography variant="body2" className="value">
                  ${stats[0].expected_salary}
                </Typography>
              </CardContent>
            </Card>
          </div>
          {/* New Card for Hourly Wage */}
          <div className="grid-item">
            <Card className="stat-card">
              <CardContent>
                <FaMoneyCheck className="icon" style={{ color: "green" }} />
                <Typography variant="h6">Hourly Wage</Typography>
                <Typography variant="body2" className="value">
                  ${stats[0].hourly_wage}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeStats;
