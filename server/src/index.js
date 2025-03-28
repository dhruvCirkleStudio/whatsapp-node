require('dotenv').config();
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const { messageRoute } = require("./routes/message.routes");
const cors = require("cors");
const { initializeSocket } = require("./services/socket");
const {connection} = require("./models/mongoConnection");

const app = express();
const port = 3000;
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(cors());
connection();
app.use(messageRoute);
initializeSocket(server);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 