const socketIo = require("socket.io");
// const { createClientInstance } = require("./whatsappClient");
const qrcode = require("qrcode");
const express = require("express");
const http = require("http");
const { clients } = require("../controller/user.controller");

const app = express();
const server = http.createServer(app);
let io;

const initializeSocket = (server) => {
  let client;
  let socketId = null;
  // client = createClientInstance();

  io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);
    socketId = socket.id;
    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });

  // WhatsApp Client QR Code event
  // client?.on("qr", (qr) => {
  //   console.log("New QR Code received. Sending to clients...");
  //   qrcode.toDataURL(qr, (err, qrCodeUrl) => {
  //     if (err) {
  //       console.error("Error generating QR Code:", err);
  //       return;
  //     }
  //     io.emit("qrCode", qrCodeUrl);
  //   });
  // });
  // client?.on("authenticated", () => {
  //   console.log("WhatsApp client Authenticated!");
  //   io.emit("whatsapp-connected", "user connected!");
  // });
  // client?.on("disconnected", async (reason) => {
  //   console.log(`⚠️ Client disconnected due to: ${reason}`);
  //   io.emit("whatsapp-disconnected", "user disconnected!");
  //   try {
  //     console.log("🛑 Closing Puppeteer before restart...");
  //     await client.destroy(); // Properly close Puppeteer session
  //   } catch (error) {
  //     console.log("Error while destroying client:", error);
  //   }

  //   console.log("🔄 Restarting client...");
  //   setTimeout(() => {
  //     client.initialize(socketId); // Reinitialize after cleanup
  //     console.log(socketId);
  //   }, 5000);
  // });

  // return io

  return io;
};

// initializeSocket(server);

module.exports = { initializeSocket, io };
