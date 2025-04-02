import axios from "axios";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import MessageHandler from "./MessageHandler";

import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  useColorScheme,
  useTheme,
} from "@mui/material";
import { Button, Modal, TextField } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";




export default function Home() {
  const { mode, setMode } = useColorScheme();
   const theme = useTheme();
  const {
    qrImg,
    users,
    setUsers,
    setCurrentUser,
    currentUser,
    modalState,
    setModalState,
  } = useSocket();

  const [userName, setUserName] = useState<string>("");
  const handleOpen = () => setModalState(true);
  const handleClose = () => setModalState(false);

  const handleAddUser = async () => {
    try { 
      const response = await axios.post("http://localhost:3000/addNewUser", {
        sessionId: userName,
      });
      console.log(response);
      setUserName("");
    } catch (error) {
      console.log("getting error while adding new user sassion! :", error);
    }
  };

  const getAllClients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getAllClients");
      console.log(response);
      const clients = response?.data?.clientsIds;
      setUsers([...clients]);
    } catch (error) {
      console.log("getting all clients :", error);
    }
  };

  useEffect(() => {
    getAllClients();
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - 240px)` },
            ml: { sm: `240px` },
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              {currentUser ? currentUser?.sessionId : "User"}
            </Typography>
            <Button
              onClick={() => {
                mode == "light" ? setMode("dark") : setMode("light");
              }}
              sx={{ marginLeft: "auto", backgroundColor: "white" }}
            >
              {mode !== "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </Button>
          </Toolbar>
        </AppBar>

        {/* DRAWERS */}
        <Box
          component="nav"
          sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* WEB VIEW DRAWER */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 240,
              },
            }}
            open
          >
            <Toolbar />
            <Divider />
            <List sx={{ height: "100%" }}>
              {users?.map((text, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={text?.sessionId}
                      onClick={() => {
                        setCurrentUser(text);
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Button
              onClick={handleOpen}
              variant="contained"
              sx={{ mt: "auto", p: 1 }}
            >
              Add user
            </Button>
          </Drawer>
        </Box>

        {/* MAIN VIEW */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 240px)` },
          }}
        >
          <Toolbar />
          <MessageHandler />
        </Box>
      </Box>
      <Modal
        open={modalState === true ? true : false}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            width: "450px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: theme.palette.secondary.main,
            boxShadow: 24,
            p: "30px",
            borderRadius: "10px",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Enter name"
            variant="outlined"
            className="w-full"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={handleAddUser}
            disabled={!userName}
          >
            generate qr Code
          </Button>
          <div className="mt-5 text-center flex flex-col items-center">
            {/* <div className="w-[200px] h-[200px]"> */}
            {qrImg ? (
              <>
                <p>Scan the QR code form whatsapp to authenticate</p>
                <img
                  src={qrImg}
                  alt="WhatsApp QR Code"
                  className="h-[200px] w-[200px]"
                />
              </>
            ) : null}
            {/* </div> */}
          </div>
        </Box>
      </Modal>
    </>
  );
}
