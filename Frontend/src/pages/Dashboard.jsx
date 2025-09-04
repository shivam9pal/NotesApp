import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Container, Button, Typography, Card, CardContent, Box, AppBar, Toolbar } from "@mui/material";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const handleAuthExpired = () => {
    localStorage.removeItem("token");
    toast.info("Session expired. Please log in again.");
    navigate("/login");
  };

  useEffect(() => {
    api.get("/notes")
      .then((res) => setNotes(res.data))
      .catch((error) => {
        if (error.code === 'ERR_NETWORK') {
          handleAuthExpired();
          return;
        }
        if (error.response && error.response.status === 401) {
          toast.error("Network Error: Please check if the backend server is running on port 8080");
        } else {
          console.error("Failed to fetch notes:", error);
        }
      });
  }, []);

  const shareNote = async (id) => {
    try {
      const res = await api.post(`/notes/${id}/share`);
      let link = `${window.location.origin}/share/${res.data.shareId}`;

      try {
        await navigator.clipboard.writeText(link);
        toast.success("Share link copied to clipboard");
      } catch (copyErr) {
        link = `${window.location.origin}/share/${res.data.shareId}`;
        toast.info(link);
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        toast.error("Network Error: Please check if the backend server is running on port 8080");
      } else {
        toast.error(`Failed to share note: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const deleteNote = async (id) => {
    const note = notes.find(n => n.id === id);
    const confirmMessage = `Are you sure you want to delete "${note?.title || 'this note'}"? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await api.delete(`/notes/${id}`);
        
        setNotes(notes.filter(note => note.id !== id));
        toast.success("Note deleted successfully!");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          handleAuthExpired();
          return;
        }
        if (error.code === 'ERR_NETWORK') {
          toast.error("Network Error: Please check if the  server is running ?");
        } else if (error.response) {
          toast.error(`Failed to delete note: ${error.response.data.message || 'Unknown error'}`);
        } else {
          toast.error(`Failed to delete note: ${error.message || 'Unknown error'}`);
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.info("Logged out");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NameKart.Note
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
