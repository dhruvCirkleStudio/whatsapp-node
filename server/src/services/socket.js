const socketIo = require("socket.io");
const { client, currentQrCode } = require("./whatsappClient");
const qrcode = require("qrcode");
let io; // Define io globally

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"]
    }
  });

  io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    // Send QR code if available
    if (currentQrCode) {
      socket.emit("qrCode", currentQrCode);
    }

    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });

  // WhatsApp Client QR Code event
  client.on("qr", (qr) => {
    console.log("New QR Code received. Sending to clients...");
    qrcode.toDataURL(qr, (err, qrCodeUrl) => {
      if (err) {
        console.error("Error generating QR Code:", err);
        return;
      }
      io.emit("qrCode", qrCodeUrl);
    });
  });

  return io;
};

module.exports = { initializeSocket, io };
