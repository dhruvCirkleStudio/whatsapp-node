const express = require("express");
const { getDefaultMessage, sendMessage } = require("../controller/message.controller");

const messageRoute = express.Router();

// messageRoute.get("/qr-code", sendQrCode);

messageRoute.post("/send-message", sendMessage);
messageRoute.post("/add-defaultMessage", getDefaultMessage);

module.exports =  { messageRoute };
