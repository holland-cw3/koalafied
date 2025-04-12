import { useState } from "react";
import TextField from "@mui/material/TextField";
import "../CSS/login.css";
import Button from "@mui/material/Button";

async function login(username, password) {
  try {
    const response = await fetch("http://localhost:5000/createAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const res = await response.json();
      localStorage.setItem("token", res.token);
      alert(localStorage.getItem('token'));
      window.location.href = "/";
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
    e.preventDefault(); // Prevent default form submission
    login(username, password); // Call the login function
  };

  return (
    <div class="container">
      <form className="loginForm" onSubmit={handleSubmit}>
      <h1>Koala-fied Login</h1>

        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          value={password}
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          type='submit'
        >
          Login
        </Button>

        <div>Don't Have an Account? Register here</div>
      </form>
    </div>
  );
}
