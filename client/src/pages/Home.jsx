import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useSocket } from "../providers/Socket";

const Homepage = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [emailId, setEmailId] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleEmailChange = (e) => {
    setEmailId(e.target.value);
  };

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleJoinRoom = useCallback(() => {
    if (socket) {
      console.log("Emitting join_room event with:", { emailId, roomId });
      socket.emit("join_room", { emailId, roomId });
      navigate(`/room/${roomId}`);
    } else {
      console.log("Socket is not connected.");
    }
  }, [socket, emailId, roomId, navigate]);

  useEffect(() => {
    if (socket) {
      const handleUserConnected = ({ emailId, roomId }) => {
        console.log(`User ${emailId} connected in room ${roomId}`);
      };

      socket.on("user-connected", handleUserConnected);

      return () => {
        socket.off("user-connected", handleUserConnected);
      };
    }
  }, [socket]);

  return (
    <div className="homepage-container">
      <div className="input-container">
        <input
          value={emailId}
          onChange={handleEmailChange}
          type="email"
          placeholder="Enter your email"
        />
        <input
          value={roomId}
          onChange={handleRoomIdChange}
          type="text"
          placeholder="Enter your code"
        />
        <button onClick={handleJoinRoom}>Enter Room</button>
      </div>
    </div>
  );
};

export default Homepage;
