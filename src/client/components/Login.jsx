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

const LoginContainer = styled(Container)({
  marginTop: 150,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const LoginForm = styled("form")({
  width: "100%",
  marginTop: 1,
});

const CredentialsInput = styled("div")({
  margin: "1rem 0",
  width: "100%"
});

const LoginButton = styled(Button)({
  margin: "1rem 0 2rem",
  width: "100%",
  backgroundColor: "#b50000"
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const login = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const result = await response.json();
  
      if (response.status === 200) {
        localStorage.setItem("token", result.token);
  
        // Clear input fields!!!
        setEmail("");
        setPassword("");
  
        setMessage("Successfully logged in!");
        // Redirect to /me
        window.location.href = "/me";
      } else if (response.status >= 400 && response.status < 500) {
        setMessage("Incorrect email or password. Please try again.");
      } else {
        setMessage("Incorrect Email or Password. Please Try Again.");
      }
    } catch (err) {
      console.error(`${err.name}: ${err.message}`);
      setMessage("Incorrect Email or Password. Please Try Again.");
    }
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <LoginContainer component="main" maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <LoginForm onSubmit={handleSubmit}>
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
        </CredentialsInput>
        <LoginButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Login
        </LoginButton>
      </LoginForm>
      <Typography variant="body2" color="textSecondary" align="center">
        Don't have an account? <Link to="/signup">Sign up today!</Link>
      </Typography>
      <Typography variant="body2" color="error" align="center">
        {message}
      </Typography>
    </LoginContainer>
  );
};

export default Login;
