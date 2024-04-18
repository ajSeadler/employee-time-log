const db = require("./client");

const getUserStatsById = async (userId) => {
  try {
    const query = `
      SELECT * FROM employee_stats
      WHERE user_id = $1;
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};

const updateEmployeeStatsById = async (userId, updatedStats) => {
  try {
    const { weeklyHours } = updatedStats;

    // Retrieve current employee stats
    const currentStatsQuery = `
      SELECT weekly_hours, monthly_hours, hourly_wage, earnings_so_far, paid_time_off
      FROM employee_stats
      WHERE user_id = $1
    `;
    const { rows } = await db.query(currentStatsQuery, [userId]);
    const { weekly_hours: currentWeeklyHours, monthly_hours: currentMonthlyHours, hourly_wage: hourlyWage, earnings_so_far: previousEarnings, paid_time_off: currentPaidTimeOff } = rows[0];

    console.log("Previous Earnings:", previousEarnings);
    console.log("Current Weekly Hours:", currentWeeklyHours);
    console.log("Hourly Wage:", hourlyWage);
    console.log("Weekly Hours to Add:", weeklyHours);

    // Calculate new values
    const updatedWeeklyHours = currentWeeklyHours + weeklyHours;
    console.log("Updated Weekly Hours:", updatedWeeklyHours);
    const updatedMonthlyHours = currentMonthlyHours + weeklyHours; // Add weekly hours to monthly hours
    console.log("Updated Monthly Hours:", updatedMonthlyHours);
    const updatedEarnings = weeklyHours * hourlyWage; // Update earnings based on new weekly hours
    console.log("Updated Earnings:", updatedEarnings);
    const updatedExpectedSalary = updatedMonthlyHours * hourlyWage; // Update expected salary based on new monthly hours

    // Update employee stats
    const updateQuery = `
      UPDATE employee_stats
      SET weekly_hours = $1, monthly_hours = $2, expected_salary = $3, earnings_so_far = $4
      WHERE user_id = $5
    `;

    await db.query(updateQuery, [updatedWeeklyHours, updatedMonthlyHours, updatedExpectedSalary, updatedEarnings, userId]);
    console.log(`Employee stats updated for user with ID ${userId}`);
  } catch (error) {
    console.error("Error updating employee stats:", error);
    throw error;
  }
};






module.exports = {
  getUserStatsById,
  updateEmployeeStatsById,
};
