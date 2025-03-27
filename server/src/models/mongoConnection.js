const mongoose = require("mongoose");

const connection = async()=>{
    try {
        const response = await mongoose.connect(process.env.MONGODB_CONNECTION_URI);
        console.log("Mongodb connected");
    } catch (error) {
        console.log("mongodb is not connecting",error)
    }
}

module.exports = {connection}