import React, { useEffect } from "react";
import "../App.css";
import { useSocket } from "../providers/Socket";

const Homepage = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      console.log("Emitting join-room event");
      socket.emit("join-room", { RoomId: "1", EmailId: "anything@gmail.com" });
    } else {
      console.log("Socket not defined yet");
    }
  }, [socket]);

  return (
    <div className="homepage-container">
      <div className="input-container">
        <input type="email" placeholder="Enter your email" />
        <input type="text" placeholder="Enter your code" />
        <button>Enter Room</button>
      </div>
    </div>
  );
};

export default Homepage;
