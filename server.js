const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the message schema and model
const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

app.use(express.static("public"));

// Load messages from the database when the server starts
async function loadMessages() {
  const messages = await Message.find().sort("timestamp");
  return messages;
}

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send previous messages to the newly connected client
  loadMessages().then((messages) => {
    socket.emit("previousMessages", messages);
  });

  socket.on("chat message", async (msg) => {
    // Save the new message to the database
    const message = new Message(msg);
    await message.save();

    // Broadcast the new message to all clients
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
