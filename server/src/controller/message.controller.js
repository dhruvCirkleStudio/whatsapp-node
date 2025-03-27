const { client } = require("../services/whatsappClient");
const { DefaultMsg } = require("../models/defaultMsg.model");

const sendMessage = async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: "Number and message are required" });
  }

  const formattedNumber = number.includes("@c.us")
    ? `91${number}`
    : `91${number}@c.us`;

  try {
    await client.sendMessage(formattedNumber, message);
    res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getDefaultMessage = async (req, res) => {
  try {
    const { defaultMsg } = req.body;

    if (!defaultMsg) {
      return res.status(400).json({ error: "default message required!" });
    }
    const response = await DefaultMsg.create({ defaultMessage: defaultMsg });
    res
      .status(201)
      .json({ success: true, message: "Message added successfully!" });
  } catch (error) {
    console.log('error while adding default message',error)
  }
};

module.exports = { sendMessage,getDefaultMessage };
