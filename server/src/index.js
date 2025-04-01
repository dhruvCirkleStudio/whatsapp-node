require("dotenv").config();
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const { messageRoute } = require("./routes/message.routes");
const { userRoute } = require("./routes/user.routes");
const cors = require("cors");
const { initializeSocket } = require("./services/socket");
const { connection } = require("./models/mongoConnection");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// SOCKET CONNECTION
const server = http.createServer(app);
const io = initializeSocket(server);
// MONGO CONNECTION
connection();
// API ROUTES
app.use(messageRoute);
app.use(userRoute(io));

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
