const { Client, LocalAuth } = require("../../whatsappWebLib");
const qrcode = require("qrcode-terminal");
const { DefaultMsg } = require("../models/defaultMsg.model");


const client = new Client({
  authStrategy: new LocalAuth()
});

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
client.on("disconnected", async (reason) => {
  console.log(`⚠️ Client disconnected due to: ${reason}`);
  try {
    console.log("🛑 Closing Puppeteer before restart...");
    await client.destroy(); // Properly close Puppeteer session
  } catch (error) {
    console.log("Error while destroying client:", error);
  }

  console.log("🔄 Restarting client...");
  setTimeout(() => {
    client.initialize(); // Reinitialize after cleanup
  }, 5000);
});

client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

client.initialize();

module.exports = { client };
