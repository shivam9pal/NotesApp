import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, AppBar, Toolbar } from "@mui/material";
import { toast } from "react-toastify";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { username, password });
      toast.success("User registered! Please login.");
      navigate("/login");
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        toast.error("Network Error: Please check if the backend server is running on port 8080");
      } else if (error.response) {
        toast.error(`Registration failed: ${error.response.data.message || 'Username already exists'}`);
      } else {
        toast.error(`Registration failed: ${error.message || 'Username already exists'}`);
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
            Register
          </Typography>
        <form onSubmit={handleRegister}>
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
            Register
          </Button>
          <Button onClick={() => navigate("/login")} sx={{ mt: 1 }} fullWidth>
            Go to Login
          </Button>
        </form>
      </Box>
      </Container>
    </>
  );
}
