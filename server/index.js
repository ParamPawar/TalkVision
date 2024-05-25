const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const io = new Server({
  cors: true,
});
const app = express();

app.use(bodyParser.json());

const EmailIdtoSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("join_room", (data) => {
    const { roomId, emailId } = data;
    console.log("New user", emailId, "connected in room", roomId);
    EmailIdtoSocketMapping.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);
    socket.join(roomId);
    socket.emit("joined-room", { roomId });
    socket.broadcast.to(roomId).emit("user-joined", { emailId });
    io.emit("user-connected", { emailId, roomId });
  });

  socket.on("call-user", (data) => {
    const { emailId, offer } = data;
    const fromEmail = socketToEmailMapping.get(socket.id);
    const socketId = EmailIdtoSocketMapping.get(emailId);
    if (socketId) {
      io.to(socketId).emit("incoming-call", { from: fromEmail, offer });
    }
  });

  socket.on("call-accepted", (data) => {
    const { emailId, ans } = data;
    const socketId = EmailIdtoSocketMapping.get(emailId);
    socket.to(socketId).emit("call-accepted", { ans });
  });
});

app.listen(8000, () => console.log("HTTP server running on port 8000"));
io.listen(8001, () => console.log("Socket.IO server running on port 8001"));
