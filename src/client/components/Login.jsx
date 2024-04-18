import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import {
  Button,
  TextField,
  Typography,
  Container,
} from "@mui/material";

const Background = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundImage: 'url("/login-bg.svg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: -1, // Behind other content
});

const LoginContainer = styled(Container)(({ theme }) => ({
  marginTop: 150,
  width: '100%',
  padding: '70px',
  display: "flex",
  borderRadius:'10px',
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: 'rgba(255, 305, 305, 0.1)', // Transparent white
  color: '#fff',
  position: 'relative', // To position the Paper component correctly
  zIndex: 1, // Above the background image
  backdropFilter: 'blur(10px)', // Adjust blur strength as needed
  WebkitBackdropFilter: 'blur(10px)', // For Safari
}));

const LoginForm = styled("form")({
  width: "100%",
  color:'#fff',
  marginTop: 1,
});

const CredentialsInput = styled("div")({
  margin: "1rem 0",
  width: "100%"
});

const LoginButton = styled(Button)({
  margin: "1rem 0 2rem",
  width: "100%",
  backgroundColor: "#ffd166"
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
    <>
      <Background />
      <LoginContainer component="main" maxWidth="xs">
          <Typography component="h1" variant="h5" style={{fontWeight:'bolder', color:'#fff'}}>
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
                style={{backgroundColor:'white', borderRadius:'5px'}}
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
                style={{backgroundColor:'white', borderRadius:'5px'}}
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
          <Typography variant="body2" color="textprimary" align="center">
            Don't have an account? <Link to="/signup">Sign up today!</Link>
          </Typography>
          <Typography variant="body2" color="error" align="center">
            {message}
          </Typography>
        
      </LoginContainer>
    </>
  );
};

export default Login;
