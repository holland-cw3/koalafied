import { useState } from "react";
import TextField from "@mui/material/TextField";
import "../CSS/login.css";
import Button from "@mui/material/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div class="container">
      <form class="loginForm">
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
        <Button variant="contained">Login</Button>

        <div>Don't Have an Account? Register here</div>
      </form>
    </div>
  );
}
