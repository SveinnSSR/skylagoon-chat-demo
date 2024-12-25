import React, { useState } from "react";
import { TextField, Button, Box, Avatar, Typography } from "@mui/material";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const WEBHOOK_URL = 'https://sky-lagoon-chatbot-server.vercel.app/chat';
  const API_KEY = 'sky-lagoon-secret-2024';

  const handleSend = async () => {
    // ... (keep existing handleSend function as is)
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom, #003A70, #001830)", // Sky Lagoon's gradient
        backgroundImage: "url('https://www.skylagoon.com/wp-content/themes/skylagoon/assets/img/texture-dark.jpg')", // Add texture
        backgroundBlendMode: "overlay",
      }}
    >
      <Box
        sx={{
          width: 400,
          height: 600,
          backgroundColor: "rgba(255, 255, 255, 0.95)", // Slightly transparent white
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)", // Enhanced shadow
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 70,
            backgroundColor: "#003A70", // Sky Lagoon blue
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <img 
            src="https://www.skylagoon.com/wp-content/themes/skylagoon/assets/img/logo.svg"
            alt="Sky Lagoon"
            style={{ height: 30 }}
          />
        </Box>
        <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: msg.sender === "bot" ? "row" : "row-reverse",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              {msg.sender === "bot" && (
                <Avatar 
                  alt="Bot" 
                  src="/skybot.png"
                  sx={{ 
                    bgcolor: "#003A70",
                    marginRight: 1,
                    marginLeft: msg.sender === "bot" ? 0 : 1 
                  }}
                />
              )}
              <Box
                sx={{
                  maxWidth: "70%",
                  padding: 1.5,
                  borderRadius: 2,
                  backgroundColor: msg.sender === "bot" ? "#E3F2FD" : "#003A70",
                  color: msg.sender === "bot" ? "#333" : "white",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  marginBottom: 1,
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
              >
                {msg.text}
              </Box>
            </Box>
          ))}
        </Box>
        <Box 
          sx={{ 
            padding: 2, 
            display: "flex",
            backgroundColor: "white",
            borderTop: "1px solid rgba(0,0,0,0.1)"
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 58, 112, 0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 58, 112, 0.3)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#003A70",
                },
              },
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSend} 
            sx={{ 
              marginLeft: 1,
              backgroundColor: "#003A70",
              "&:hover": {
                backgroundColor: "#002850"
              }
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default App;