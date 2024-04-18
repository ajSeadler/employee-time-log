import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
`;

const SidebarContainer = styled.div`
  width: 10vw;
`;

const UpdateStatsFormContainer = styled.div`
  flex: 1;
  max-width: 50vw;
  height: auto;
  margin: 0 auto;
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #333;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Input = styled(TextField)`
  width: 100%;
  font-weight: bold;
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Icon = styled.div`
  margin-right: 8px;
`;

const Error = styled(Message)`
  color: #f44336;
`;

const Success = styled(Message)`
  color: #4caf50;
`;

const CenteredButton = styled(Button)`
  && {
    width: 100%;
    margin: 5px;
    margin-top: 16px;
    background-color: green;
  }
`;

const UpdateStatsForm = () => {
  const [weeklyHours, setWeeklyHours] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
  
      const response = await fetch('/api/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          weeklyHours: parseFloat(weeklyHours), // Convert to float before sending
          updateTimestamp: new Date().toISOString(), // Include the update timestamp
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update stats');
      }
  
      setSuccessMessage('Employee stats updated successfully.');
      navigate('/me'); // Navigate back to /me after successful update
    } catch (err) {
      setError('Failed to update stats. Please try again.');
    }
  };
  
  return (
    <PageContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <UpdateStatsFormContainer>
        <h2>Great Job Today!</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <p>Total Hours</p>
            <Input
              id="weeklyHours"
              label="Hours"
              variant="outlined"
              type="number"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(e.target.value)}
              required
            />
          </FormGroup>
          {error && (
            <Error>
              <Icon>
                <ErrorOutlineIcon />
              </Icon>
              {error}
            </Error>
          )}
          {successMessage && (
            <Success>
              <Icon>
                <CheckCircleOutlineIcon />
              </Icon>
              {successMessage}
            </Success>
          )}
          <CenteredButton type="submit" variant="contained" style={{backgroundColor: '#29391'}}>
            Update
          </CenteredButton>
        </form>
      </UpdateStatsFormContainer>
    </PageContainer>
  );
};

export default UpdateStatsForm;
