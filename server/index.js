const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const io = new Server({
  cors: true,
});
const app = express();

app.use(bodyParser.json());

const EmailIdtoSocketMapping = new Map();

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);
  socket.on("join-room", (data) => {
    const { RoomId, EmailId } = data;
    console.log("User", EmailId, "Joined Room", RoomId);
    EmailIdtoSocketMapping.set(EmailId, socket);
    socket.join(RoomId);
    socket.broadcast.to(RoomId).emit("user-joined", { EmailId });
  });
});

app.listen(8000, () => console.log("HTTP server running on port 8000"));
io.listen(8001, () => console.log("Socket.IO server running on port 8001"));
