const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const URI = process.env.MONGODB_URI;

async function ConnectDB() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to database", err);
  }
}

module.exports = ConnectDB;
