import axios from "axios";
import React, { useState } from "react";
import { useSocket } from "../context/SocketContext";
import { Bounce, ToastContainer, toast } from "react-toastify";
import {
  Box,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  MoveToInbox as InboxIcon,
  Mail as MailIcon,
  Menu as MenuIcon 
} from "@mui/icons-material";

export default function Home() {
  interface msgData {
    number: string;
    message: string;
  }
  const { qrImg } = useSocket();
  const [msgData, seMsgtData] = useState<msgData>({ number: "", message: "" });
  const [defaultMesage, setDefaultMwssage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250, height:'100%', backgroundColor:"#ece5dd" }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Authenticate", "Send Message", "Set Defaul Message"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

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

  return (
    <div className="flex justify-center">
      <Button
        onClick={toggleDrawer(true)}
        sx={{
          position: "absolute",
          left:10,
          top:15
        }}
      >
        <MenuIcon/>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
