const express = require('express');
const bodyParser = require('body-parser');
const {Server} = require('socket.io')

const io = new Server ();
const app = express();
 

app.use(bodyParser.json());

io.on("connection", (socket) => {
	
});


app.listien(8000,() => console.log("Http server running at 8000 port"));
io.listien(8001);

