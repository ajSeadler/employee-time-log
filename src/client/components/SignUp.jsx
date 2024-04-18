import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import {
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
} from "@mui/material";



const SignUpContainer = styled(Container)({
  marginTop: 150,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const SignUpForm = styled("form")({
  width: "100%",
  marginTop: 1,
});

const CredentialsInput = styled("div")({
  margin: "1rem 0",
  width: "100%",
});

const SignUpButton = styled(Button)({
  margin: "1rem 0 2rem",
  width: "100%",
  backgroundColor: "#b50000",
});

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Check password length
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const signUp = async () => {
    try {
      // Additional check for password length
      if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters long.");
        return;
      }

      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await response.json();
      setMessage(result.message);

      if (!response.ok) {
        throw result;
      }

      localStorage.setItem("token", result.token);

      setName("");
      setEmail("");
      setPassword("");
      setPasswordError("");
      window.location.href = "/me";
    } catch (err) {
      console.error(`${err.name}: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signUp();
  };

  return (
    <SignUpContainer component="main" maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5">
        Sign Up
      </Typography>
      <SignUpForm onSubmit={handleSubmit}>
        <CredentialsInput>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="name"
            label="Name"
            type="text"
            value={name}
            onChange={handleNameChange}
            required
          />
        </CredentialsInput>
        <CredentialsInput>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </CredentialsInput>
        <CredentialsInput>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {/* Display password error */}
          {passwordError && (
            <Typography variant="body2" color="error" align="center">
              {passwordError}
            </Typography>
          )}
        </CredentialsInput>
        <SignUpButton type="submit" fullWidth variant="contained" color="primary">
          Sign Up
        </SignUpButton>
      </SignUpForm>
      <Typography variant="body2" color="textSecondary" align="center">
        Already have an account? <Link to="/login">Login here</Link>
      </Typography>
      <Typography variant="body2" color="error" align="center">
        {message}
      </Typography>
    </SignUpContainer>
  );
};

export default SignUp;
