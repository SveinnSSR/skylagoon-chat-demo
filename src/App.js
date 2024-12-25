import React, { useState } from "react";
import { TextField, Button, Box, Avatar, Typography } from "@mui/material";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const WEBHOOK_URL = 'https://sky-lagoon-chatbot-server.vercel.app/chat';
  const API_KEY = 'sky-lagoon-secret-2024';

  const handleSend = async () => {
    if (input.trim()) {
      // Add user's message
      const newMessages = [...messages, { sender: "user", text: input }];
      setMessages(newMessages);

      try {
        // Add loading message
        setMessages([...newMessages, { sender: "bot", text: "..." }]);

        // Send to webhook
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ message: input })
        });

        const data = await response.json();

        // Update messages with bot response
        setMessages([
          ...newMessages,
          { sender: "bot", text: data.message || "I apologize, but I'm having trouble processing your request." }
        ]);

      } catch (error) {
        console.error('Error:', error);
        setMessages([
          ...newMessages,
          { sender: "bot", text: "I apologize, but I'm having trouble connecting right now." }
        ]);
      }

      setInput("");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          width: 400,
          height: 600,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 60,
            backgroundColor: "#007acc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            Sky Lagoon Chat
          </Typography>
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
              {msg.sender === "bot" && <Avatar alt="Bot" src="skybot.png" />}
              <Box
                sx={{
                  maxWidth: "70%",
                  padding: 1,
                  borderRadius: 1,
                  backgroundColor: msg.sender === "bot" ? "#e0f7fa" : "#cfe9fe",
                  color: "#333",
                }}
              >
                {msg.text}
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ padding: 2, display: "flex" }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button variant="contained" onClick={handleSend} sx={{ marginLeft: 1 }}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default App;