const { Server } = require("socket.io");

const io = new Server(8000)

io.on("connecction",(socket) => {
    console.log("socket Connectded",socket.id);
});