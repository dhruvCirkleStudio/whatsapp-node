const express = require("express");
const { addNewUser,getAllClients } = require("../controller/user.controller");

const userRoute = (io) => {

  const router = express.Router();

  router.post("/addNewUser", (req, res) => addNewUser(req, res, io));
  router.get("/getAllClients", (req, res) => getAllClients(req, res, io));

  return router;

};

module.exports = { userRoute };
