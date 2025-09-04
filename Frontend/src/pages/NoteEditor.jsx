import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/notes/${id}`)
        .then((res) => {
          setNote(res.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          if (error.code === 'ERR_NETWORK') {
            alert("Network Error: Please check if the backend server is running on port 8080");
          } else if (error.response) {
            if (error.response.status === 403) {
              alert("Access denied: You don't have permission to view this note. Redirecting to dashboard.");
              navigate("/dashboard");
            } else if (error.response.status === 404) {
              alert("Note not found. Redirecting to dashboard.");
              navigate("/dashboard");
            } else {
              alert(`Failed to load note: ${error.response.data.message || error.message}`);
            }
          } else {
            alert(`Failed to load note: ${error.message || 'Unknown error'}`);
          }
        });
    }
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      if (id) {
        await api.put(`/notes/${id}`, note);
      } else {
        await api.post("/notes", note);
      }
      navigate("/dashboard");
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        alert("Network Error: Please check if the backend server is running on port 8080");
      } else if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to save note'}`);
      } else {
        alert(`Error: ${error.message || 'Failed to save note'}`);
      }
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box mt={5}>
          <Typography variant="h5">Loading note...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h5">{id ? "Edit Note" : "Create Note"}</Typography>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
        />
        <TextField
          label="Content"
          fullWidth
          margin="normal"
          multiline
          rows={6}
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
          <Button onClick={handleCancel} variant="outlined">
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
