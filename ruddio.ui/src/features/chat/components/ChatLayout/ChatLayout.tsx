import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Avatar,
  Paper,
  Stack,
  Container,
  InputAdornment,
  Card,
  IconButton,
  useTheme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
} from "@mui/material";
import styles from "./ChatLayout.module.scss";
import classnames from "classnames";

// const MessageBubble = styled(Card)(({ theme, sent }) => ({
//   maxWidth: "70%",
//   padding: "12px 16px",
//   backgroundColor: sent
//     ? theme.palette.mode === "dark"
//       ? "#0d47a1"
//       : "#1976d2"
//     : theme.palette.mode === "dark"
//       ? "#424242"
//       : "#fff",
//   color: sent ? "#fff" : theme.palette.mode === "dark" ? "#fff" : "inherit",
//   borderRadius: "16px",
//   boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//   transition: "transform 0.2s",
//   "&:hover": {
//     transform: "scale(1.02)",
//   },
// }));

export const ChatLayout = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dummyContacts = [
    {
      id: 1,
      name: "John Doe",
      avatar: "images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      lastMessage: "Hey, how are you?",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330",
      lastMessage: "See you tomorrow!",
    },
  ];

  const dummyMessages = [
    { id: 1, text: "Hi there!", sent: false, timestamp: "09:00 AM" },
    { id: 2, text: "Hello! How are you?", sent: true, timestamp: "09:01 AM" },
    {
      id: 3,
      text: "I'm doing great, thanks for asking!",
      sent: false,
      timestamp: "09:02 AM",
    },
  ];

  useEffect(() => {
    setMessages(dummyMessages);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sent: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const contactsList = (
    <>
      <TextField
        fullWidth
        placeholder="Search contacts"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">search</InputAdornment>
          ),
        }}
      />
      <Stack spacing={2}>
        {dummyContacts.map((contact) => (
          <Box
            key={contact.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              p: 1,
              borderRadius: 1,
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
            onClick={() => isMobile && handleDrawerToggle()}
          >
            <Avatar
              src={`https://${contact.avatar}`}
              alt={contact.name}
              sx={{ width: 56, height: 56 }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {contact.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {contact.lastMessage}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </>
  );

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ height: "100vh", p: { xs: 0, md: 2 } }}>
        <div className={classnames(styles.wrapper)}>
          <div className={classnames(styles.contactsList)}>{contactsList}</div>

          <div className={classnames(styles.chatArea)}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={`https://${dummyContacts[0].avatar}`}
                  alt={dummyContacts[0].name}
                />
                <Typography variant="h6">{dummyContacts[0].name}</Typography>
              </Box>
              <IconButton aria-label="settings">settings</IconButton>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mb: 2,
                p: 1,
              }}
            >
              {messages.map((message) => (
                <div
                  className={classnames(styles.messageContainer)}
                  key={message.id}
                >
                  <div className={classnames(styles.messageBubble)}>
                    <Typography variant="body1">{message.text}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 0.5, opacity: 0.7 }}
                    >
                      {message.timestamp}
                    </Typography>
                  </div>
                </div>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                aria-label="send message"
              >
                send
              </IconButton>
            </Box>
          </div>
        </div>
      </Container>
    </>
  );
};
