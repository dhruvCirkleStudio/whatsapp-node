import axios from "axios";
import { useState } from "react";
import { toast } from "../utils/ToastNotification";
import { useSocket } from "../context/SocketContext";
import { Box, Button, TextField, useTheme } from "@mui/material";
// import { useTheme, useColorScheme } from "@mui/joy";

export default function MessageHandler() {
  const theme = useTheme();
  interface msgData {
    number: string;
    message: string;
  }

  const { currentUser } = useSocket();

  const [msgData, seMsgtData] = useState<msgData>({ number: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [defaultMesage, setDefaultMwssage] = useState<string>("");

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    seMsgtData({
      ...msgData,
      [name]: value,
    });
    validate(name, value);
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
      let sessionId = currentUser.sessionId;
      console.log(sessionId);

      const response = await axios.post("http://localhost:3000/send-message", {
        ...msgData,
        sessionId,
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
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        className="p-10 mt-10 w-[600px] rounded-lg shadow-2xl "
        sx={{ bgcolor: theme.palette.secondary.main }}
      >
        <TextField
          type="text"
          id="outlined-basic"
          label="Enter phone Number"
          name="number"
          value={msgData?.number}
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <p className="text-red-500 w-full">{errors.number}</p>
        <TextField
          type="text"
          id="outlined-basic"
          label="Enter message"
          name="message"
          sx={{ marginTop: 2 }}
          value={msgData?.message}
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <p className="text-red-500 w-full">{errors.message}</p>
        <Button
          type="submit"
          sx={{
            backgroundColor: "#128c7e",
            color: "white",
            px: 2,
            py: 1,
            marginTop: 2,
          }}
          onClick={(e) => handleSendMessage(e)}
        >
          Send Message
        </Button>
      </Box>
      <Box
        className="p-10 mt-10 w-[600px] rounded-lg shadow-2xl"
        sx={{ bgcolor: theme.palette.secondary.main }}
      >
        <TextField
          type="text"
          id="outlined-basic"
          label="set default message"
          name="number"
          sx={{}}
          value={defaultMesage}
          onChange={(e) => {
            setDefaultMwssage(e.target.value);
          }}
        />
        <br />
        <Button
          type="submit"
          sx={{
            backgroundColor: "#128c7e",
            color: "white",
            px: 2,
            py: 1,
            marginTop: 2,
          }}
          onClick={(e) => updateDefaultMessage(e)}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
