import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";

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
            toast.error("Network Error: Please check if the backend server is running on port 8080");
          } else if (error.response) {
            if (error.response.status === 403) {
              toast.error("Access denied: You don't have permission to view this note.");
              navigate("/dashboard");
            } else if (error.response.status === 404) {
              toast.error("Note not found.");
              navigate("/dashboard");
            } else {
              toast.error(`Failed to load note: ${error.response.data.message || error.message}`);
            }
          } else {
            toast.error(`Failed to load note: ${error.message || 'Unknown error'}`);
          }
        });
    }
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      if (id) {
        await api.put(`/notes/${id}`, note);
        toast.success("Note updated");
      } else {
        await api.post("/notes", note);
        toast.success("Note created");
      }
      navigate("/dashboard");
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        toast.error("Network Error: Please check if the backend server is running on port 8080");
      } else if (error.response) {
        toast.error(`Error: ${error.response.data.message || 'Failed to save note'}`);
      } else {
        toast.error(`Error: ${error.message || 'Failed to save note'}`);
      }
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
    toast.info("Changes discarded");
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
