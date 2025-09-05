import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, AppBar, Toolbar } from "@mui/material";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        toast.error("Network Error: Please check if the backend server is running on port 8080");
      } else if (error.response) {
        toast.error(`Login failed: ${error.response.data.message || 'Invalid credentials'}`);
      } else {
        toast.error(`Login failed: ${error.message || 'Invalid credentials'}`);
      }
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NameKart.Note
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box mt={10} p={4} boxShadow={3} borderRadius={2}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
          <Button
            onClick={() => navigate("/register")}
            sx={{ mt: 1 }}
            fullWidth
          >
            Go to Register
          </Button>
        </form>
      </Box>
      </Container>
    </>
  );
}
