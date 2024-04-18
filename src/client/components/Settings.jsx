import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const PageContainer = styled.div`
  display: flex;
  width: 100vw;
  align-items: center;
  height: 100vh;
`;

const SidebarContainer = styled.div`
  width: 10vw;
`;

const SettingsContainer = styled.div`
  flex: 1;
  max-width: 30vw;
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
    color: #fff;
    background-color: green;
  }
`;

const Settings = () => {
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleUpdateName = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/name`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newName }),
      });
      const data = await response.json();
      setSuccessMessage(data.message);
    } catch (err) {
      setError('Failed to update name. Please try again.');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/email`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail }),
      });
      const data = await response.json();
      setSuccessMessage(data.message);
    } catch (err) {
      setError('Failed to update email. Please try again.');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await response.json();
      setSuccessMessage(data.message);
    } catch (err) {
      setError('Failed to update password. Please try again.');
    }
  };

  return (
    <PageContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <SettingsContainer>
        <h2>Settings</h2>
        <FormGroup>
          <Input
            fullWidth
            variant="outlined"
            label="New Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <CenteredButton onClick={handleUpdateName}>Update Name</CenteredButton>
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
      </SettingsContainer>
    </PageContainer>
  );
};

export default Settings;
