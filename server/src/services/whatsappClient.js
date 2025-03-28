const { Client, LocalAuth } = require("../../whatsappWebLib");
const qrcode = require("qrcode-terminal");
const { DefaultMsg } = require("../models/defaultMsg.model");

let currentQrCode = null;

const client = new Client({
  authStrategy: new LocalAuth(),
});

// client.on("ready", () => {
//   console.log("WhatsApp client is ready!");
// });

client.on("message", async (message) => {
  const defaultMessage = await DefaultMsg.findOne().sort({ _id: -1 });
  console.log(defaultMessage);
  console.log(`New message from ${message.from}: ${message.body}`);
  if (message.body.toLowerCase() === "q") {
    await client.sendMessage(
      message.from,
      defaultMessage ? defaultMessage.defaultMessage : "hello there! how can i help you?"
    );
  }
});

client.initialize();

module.exports = { client };
