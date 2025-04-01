const { Client, LocalAuth } = require("../../whatsappWebLib");
const qrcode = require("qrcode");

const clients = {};
const addNewUser = async (req, res,io) => {

  const { sessionId } = req.body;

  if(!sessionId)  return res.status(400).json({ error: "seasionId required!" }); 

  if (clients[sessionId])
    return res.json({ message: "Session already exists." });

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: sessionId }),
    puppeteer: { headless: true },
  });

  clients[sessionId] = client;

  client?.on("qr", (qr) => {
    console.log("New QR Code received. Sending to clients...");
    qrcode.toDataURL(qr, (err, qrCodeUrl) => {
      if (err) {
        console.error("Error generating QR Code:", err);
        return;
      }
      io.emit("qrCode", qrCodeUrl);
    });
  });

  client.on("ready", () => {
    console.log("whatsapp client ready");
    io.emit("ready", { sessionId });
  });

  client.on("authenticated", () => {
    console.log("whatsapp authenticated!");
    io.emit("authenticated", { sessionId });  
  });

  client.on("disconnected", async() => {
    console.log("disconnected! :",sessionId);
    io.emit("disconnected", { sessionId });
    delete clients[sessionId];
    await client.destroy();
  });

  await client.initialize();
  res.json({ message: "Session started", sessionId });

};

const getAllClients = (req,res,io)=>{
  const clientsIds = Object.entries(clients).map((item)=>{return{sessionId:item[1].authStrategy.clientId}})
  console.log(clientsIds)
  res.status(200).json({status:'success',clientsIds})
}

module.exports = { addNewUser, clients,getAllClients };
