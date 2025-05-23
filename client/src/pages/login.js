import { useState } from "react";
import TextField from "@mui/material/TextField";
import "../CSS/login.css";
import Button from "@mui/material/Button";
import logo from '../images/logo.png';

async function login(username, password) {
  try {
    const response = await fetch("https://koala-fied-3.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const res = await response.json();
      localStorage.setItem("token", res.token);
      window.location.href = "/dashboard";
    } else {
      alert("Login Failed: Username or Password is incorrect");
    }
  } catch (error) {
    console.error("Error submitting data:", error);
  }
}
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="container">
      <form className="loginForm" onSubmit={handleSubmit}>
        <img src={logo} alt="logo" />


        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          value={username}
          required
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#d2b48c",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.9)", // Custom box shadow
            },
            "& .MuiInputLabel-root": {
              color: "green", // Change this to your desired label color
              fontWeight: "bold",
              textShadow: " 1px 1px 0 #000",
              fontSize: "20px",
            },
            "& .MuiOutlinedInput-root.Mui-focused": {
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.9)", // Focused state shadow
            },
          }}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          required
          value={password}
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#d2b48c",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.9)", // Custom box shadow
            },
            "& .MuiInputLabel-root": {
              color: "green", // Change this to your desired label color
              fontWeight: "bold",
              textShadow: " 1px 1px 0 #000",
              fontSize: "20px",
            },
            "& .MuiOutlinedInput-root.Mui-focused": {
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.9)", // Focused state shadow
            },
          }}
        />
        <Button
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: "green",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.9)", // Custom box shadow
            width:'100%',
            marginBottom:'10px'
          }}
        >
          Login
        </Button>

        <div class='altLogin'>
          New User? <a href="/register">Sign-Up Here!</a>
        </div>
      </form>
    </div>
  );
}
