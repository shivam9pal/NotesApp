import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Container, Button, Typography, Card, CardContent, Box, AppBar, Toolbar } from "@mui/material";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/notes")
      .then((res) => setNotes(res.data))
      .catch((error) => {
        if (error.code === 'ERR_NETWORK') {
          alert("Network Error: Please check if the backend server is running on port 8080");
        } else {
          console.error("Failed to fetch notes:", error);
        }
      });
  }, []);

  const shareNote = async (id) => {
    try {
      const res = await api.post(`/notes/${id}/share`);
      alert(`Public link: http://localhost:5173/share/${res.data.shareId}`);
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        alert("Network Error: Please check if the backend server is running on port 8080");
      } else {
        alert(`Failed to share note: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const deleteNote = async (id) => {
    const note = notes.find(n => n.id === id);
    const confirmMessage = `Are you sure you want to delete "${note?.title || 'this note'}"? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await api.delete(`/notes/${id}`);
        // Remove the note from the local state
        setNotes(notes.filter(note => note.id !== id));
        alert("Note deleted successfully!");
      } catch (error) {
        if (error.code === 'ERR_NETWORK') {
          alert("Network Error: Please check if the backend server is running on port 8080");
        } else if (error.response) {
          alert(`Failed to delete note: ${error.response.data.message || 'Unknown error'}`);
        } else {
          alert(`Failed to delete note: ${error.message || 'Unknown error'}`);
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Notes App
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant="h4" gutterBottom mt={2}>
          My Notes
        </Typography>
        <Button onClick={() => navigate("/editor")} variant="contained" sx={{ mb: 2 }}>
          Create New Note
        </Button>
      {notes.map((note) => (
        <Card key={note.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{note.title}</Typography>
            <Typography>{note.content}</Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button 
                onClick={() => navigate(`/editor/${note.id}`)} 
                variant="outlined" 
                size="small"
              >
                Edit
              </Button>
              <Button 
                onClick={() => shareNote(note.id)} 
                variant="outlined" 
                size="small"
              >
                Share
              </Button>
              <Button 
                onClick={() => deleteNote(note.id)} 
                variant="outlined" 
                color="error" 
                size="small"
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
      </Container>
    </>
  );
}
