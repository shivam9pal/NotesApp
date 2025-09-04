import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Box, Paper, Chip } from "@mui/material";

export default function PublicNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    // Set a timeout for 6 seconds
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 6000);

    axios.get(`http://localhost:8080/api/notes/share/${id}`)
      .then((res) => {
        clearTimeout(timeoutId);
        setNote(res.data);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error("Failed to load public note:", error);
        setLoadingTimeout(true);
      });

    // Cleanup timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [id]);

  if (!note) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          {!loadingTimeout ? (
            <>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '3px solid #20B2AA',
                  borderTop: '3px solid transparent'
                }}
              />
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300 }}>
                Loading your note...
              </Typography>
            </>
          ) : (
            <>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: '#ff6b6b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
                }}
              >
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  !
                </Typography>
              </Box>
              <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500, textAlign: 'center' }}>
                Note has been deleted
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 300 }}>
                This note is no longer available. It may have been deleted by the author or the link has expired.
              </Typography>
            </>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Chip 
            label="Shared Note" 
            sx={{ 
              mb: 2,
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)',
              fontWeight: 500
            }}
          />
        </Box>
        
        {}
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #20B2AA 0%, #17a2b8 100%)',
            color: 'white',
            borderRadius: '24px 24px 8px 24px',
            p: 3,
            position: 'relative',
            maxWidth: '100%',
            wordWrap: 'break-word',
            boxShadow: '0 20px 40px rgba(32, 178, 170, 0.3), 0 8px 16px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            
          }}
        >
          {}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1.2rem',
                lineHeight: 1.3,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                letterSpacing: '-0.01em'
              }}
            >
              {note.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.8rem',
                  opacity: 0.9,
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.3 }}>
                <Box 
                  sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 5, 
                      height: 5, 
                      borderRadius: '50%', 
                      backgroundColor: 'white',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  />
                </Box>
                <Box 
                  sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 5, 
                      height: 5, 
                      borderRadius: '50%', 
                      backgroundColor: 'white',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          
          {}
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.6,
              fontSize: '1.05rem',
              whiteSpace: 'pre-wrap',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              fontWeight: 400,
              letterSpacing: '0.01em'
            }}
          >
            {note.content}
          </Typography>
        </Paper>
        
        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.85rem',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            This note was shared with you
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
