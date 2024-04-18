import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button } from '@mui/material';
import Sidebar from './Sidebar';
import styled from 'styled-components';
import { AlarmOn as ClockInIcon, AlarmOff as ClockOutIcon } from '@mui/icons-material';

const PageContainer = styled.div`
  display: flex;
`;

const SidebarContainer = styled.div`
  width: 10vw;
  position: sticky;
  top: 0;
  height: 100vh;
  background-color: #1b263b;
`;

const TimeStampChartContainer = styled.div`
  flex: 1;
  padding: 50px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const GridItem = styled(Paper)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: ${props => props.clockType === 'clock_in' ? '#FBAE3C' : '#001220'};
`;


const ClockInIconStyled = styled(ClockInIcon)`
  color: green;
  font-size: 3rem;
`;

const ClockOutIconStyled = styled(ClockOutIcon)`
  color: grey;
  font-size: 3rem;
`;

const DateText = styled(Typography)`
  font-weight: bold;
  margin-bottom: 10px;
`;

const TimeStampChart = ({ userData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeStamps, setTimeStamps] = useState([]);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const fetchTimeStamps = async () => {
      try {
        const userId = userData ? userData.id : null;
        if (!userId) {
          throw new Error('User ID not found');
        }
        
        const response = await fetch(`/api/timestamps/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch timestamps');
        }
        
        const timeStampData = await response.json();
        setTimeStamps(timeStampData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTimeStamps();
  }, []);

  useEffect(() => {
    const calculateHoursForTimeStamps = () => {
      let totalHoursForMonth = 0;
      for (let i = 0; i < timeStamps.length; i += 2) {
        if (timeStamps[i] && timeStamps[i + 1]) {
          const clockInTime = new Date(timeStamps[i].timestamp);
          const clockOutTime = new Date(timeStamps[i + 1].timestamp);
          const clockInHours = clockInTime.getHours() % 12 || 12;
          const clockOutHours = clockOutTime.getHours() % 12 || 12;
          const hoursDiff = (clockOutHours - clockInHours + (clockOutTime.getDate() !== clockInTime.getDate() ? 12 : 0)) +
            (clockOutTime.getMinutes() - clockInTime.getMinutes()) / 60; // Convert minutes to hours
          totalHoursForMonth += hoursDiff;
        }
      }
      setTotalHours(parseFloat(totalHoursForMonth.toFixed(1))); // Round to 1 decimal place
    };
  
    calculateHoursForTimeStamps();
  }, [timeStamps]);
  
  

  const handleClockIn = async () => {
    try {
      const userId = userData.id;
      const response = await fetch(`/api/timestamps/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action: 'clock_in' }),
      });
      if (!response.ok) {
        throw new Error('Failed to clock in');
      }
      
      setLoading(true); // Set loading to true to indicate that a request is in progress
  
      // Fetch the updated timestamps after clocking in
      const updatedResponse = await fetch(`/api/timestamps/${userId}`);
      if (!updatedResponse.ok) {
        throw new Error('Failed to fetch updated timestamps');
      }
      
      const updatedTimeStampData = await updatedResponse.json();
      setTimeStamps(updatedTimeStampData); // Update the state with the updated timestamps
      setLoading(false); // Set loading to false after updating the state
    } catch (error) {
      console.error('Error clocking in:', error);
      setLoading(false); // Make sure to set loading to false in case of an error
    }
  };

  const handleClockOut = async () => {
    try {
      const userId = userData.id;
      const response = await fetch(`/api/timestamps/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action: 'clock_out' }),
      });
      if (!response.ok) {
        throw new Error('Failed to clock out');
      }
      
      setLoading(true); // Set loading to true to indicate that a request is in progress
  
      // Fetch the updated timestamps after clocking out
      const updatedResponse = await fetch(`/api/timestamps/${userId}`);
      if (!updatedResponse.ok) {
        throw new Error('Failed to fetch updated timestamps');
      }
      
      const updatedTimeStampData = await updatedResponse.json();
      setTimeStamps(updatedTimeStampData); // Update the state with the updated timestamps
      setLoading(false); // Set loading to false after updating the state
    } catch (error) {
      console.error('Error clocking out:', error);
      setLoading(false); // Make sure to set loading to false in case of an error
    }
  };

  return (
    <PageContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <TimeStampChartContainer>
        <Typography variant="h5" gutterBottom style={{ color: '#fff', fontWeight: 'bolder' }}>
          My Timesheet
        </Typography>
        <Button
          variant="contained"
          onClick={handleClockIn}
          style={{ marginRight: '10px', backgroundColor: 'green', margin: '10px' }}
        >
          Clock In
        </Button>
        <Button
          variant="contained"
          onClick={handleClockOut}
          style={{ backgroundColor: 'grey', margin: '10px' }}
        >
          Clock Out
        </Button>
        <Typography variant="h6" style={{ fontWeight: 'bold', marginTop: '20px' }}>
          Total Hours for Month: {totalHours}
        </Typography>
        <GridContainer>
          {timeStamps.map((timestamp, index) => (
            <GridItem key={index} elevation={3} clockType={timestamp.event_type}>
              <DateText variant="h6">{new Date(timestamp.timestamp).toLocaleDateString()}</DateText>
              {timestamp.event_type === 'clock_in' ? (
                <ClockInIconStyled />
              ) : (
                <ClockOutIconStyled />
              )}
              <Typography variant="body1">{new Date(timestamp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
            </GridItem>
          ))}
        </GridContainer>
      </TimeStampChartContainer>
    </PageContainer>
  );
};

export default TimeStampChart;
