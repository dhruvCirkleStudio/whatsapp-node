import axios from "axios";
import React, { useState } from "react";
import { useSocket } from "../context/SocketContext";
import { toast } from "../utils/ToastNotification";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function Home() {
  interface msgData {
    number: string;
    message: string;
  }
  const { qrImg,data } = useSocket();
  const [msgData, seMsgtData] = useState<msgData>({ number: "", message: "" });
  const [defaultMesage, setDefaultMwssage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    seMsgtData({
      ...msgData,
      [name]: value,
    });
    validate(name, value);
  };

  const validate = (name: string, value: string) => {
    const error: Record<string, string> = {};
    if (name === "message") {
      if (!value) {
        error[name] = "please enter message!";
      } else {
        error[name] = "";
      }
    }
    if (name === "number") {
      const numberRegex = /^\d{10}$/;
      if (!value) {
        error[name] = "please enter Number!";
      } else if (!numberRegex.test(value)) {
        error[name] = "Number should be 10 digits!";
      } else {
        error[name] = "";
      }
    }
    setErrors((prev) => ({
      ...prev,
      ...error,
    }));
  };

  const handleSendMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    Object.entries(msgData).forEach((item) => {
      validate(item[0], item[1]);
    });
    if (Object.entries(errors).every((item) => item[1] === "")) {
      // console.log(errors);
      sendMessage();
    }
  };
  const sendMessage = async () => {
    try {
      const response = await axios.post("http://localhost:3000/send-message", {
        ...msgData,
      });
      seMsgtData({
        number: "",
        message: "",
      });
      console.log("Message sent:", response.data);
      toast("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateDefaultMessage = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    console.log("updateDefaultMessage");
    const response = await axios.post(
      "http://localhost:3000/add-defaultMessage",
      { defaultMsg: defaultMesage }
    );
    console.log("default message set", response);
    setDefaultMwssage("");
    toast("Default Message set successfully!");
  };

  const drawerContent = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </div>
  );
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            User
          </Typography>
        </Toolbar>
      </AppBar>

      {/* DRAWERS */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            User
          </Typography>
        </Toolbar>
        {/* MOBLE VIEW DRAWER */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* WEB VIEW DRAWER */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* MAIN VIEW */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <div className="flex justify-center">
          <div className="mt-10">
            {/* Display the QR code if available */}
            {qrImg && (
              <div className="mt-5 text-center flex flex-col items-center">
                <p>Scan the QR code to authenticate:</p>
                <img
                  src={qrImg}
                  alt="WhatsApp QR Code"
                  style={{ width: "200px" }}
                />
              </div>
            )}

            <div className="mt-10 w-[600px]">
              <form className="p-10 rounded-lg shadow-2xl bg-[#ece5dd]">
                <input
                  type="text"
                  className="border w-full p-2 rounded"
                  placeholder="Enter phone Number"
                  name="number"
                  value={msgData?.number}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <span className="text-red-500">{errors.number}</span>
                <input
                  type="text"
                  className="mt-5 border w-full p-2 rounded"
                  placeholder="Enter message"
                  name="message"
                  value={msgData?.message}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <p className="text-red-500">{errors.message}</p>
                <button
                  type="submit"
                  className="mt-5 text-white font-bold p-2 px-4 me-2 rounded bg-[#128c7e]"
                  onClick={(e) => handleSendMessage(e)}
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className="mt-10 w-[600px]">
              <form className="p-10 rounded-lg shadow-2xl bg-[#ece5dd]">
                <input
                  type="text"
                  className="border w-full p-2 rounded"
                  placeholder="set default message"
                  name="number"
                  value={defaultMesage}
                  onChange={(e) => {
                    setDefaultMwssage(e.target.value);
                  }}
                />
                <button
                  type="submit"
                  className="mt-5 text-white font-bold p-2 px-4 me-2 rounded bg-[#128c7e]"
                  onClick={(e) => updateDefaultMessage(e)}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
}
