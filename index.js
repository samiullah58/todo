require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();

const PORT = process.env.PORT;
const mongodbUrl = process.env.MONGODB_URI;

app.get("/", (req, res) => {
  res.send("This is todo application.");
});

require("./startup/route")(app);

async function connectToDatabase() {
  try {
    await mongoose.connect(mongodbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error Connecting to MongoDB:", error);
  }
}

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`);
  });
});
