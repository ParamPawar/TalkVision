import React, { useEffect, useCallback, useState, useRef } from "react";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";

const RoomPage = () => {
  const { socket } = useSocket();
  const {
    createOffer,
    createAnswer,
    setRemoteDescription,
    sendStream,
    reometStream,
  } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const videoRef = useRef(null);

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setMyStream(stream);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  }, []);

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("New user joined room", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("Incoming call", from, offer);
      const answer = await createAnswer(offer);
      socket.emit("answer-call", { emailId: from, answer });
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { answer } = data;
      console.log("Call accepted", answer);
      setRemoteDescription(answer);
      sendStream(myStream);
    },
    [setRemoteDescription, sendStream, myStream]
  );

  useEffect(() => {
    if (socket) {
      socket.on("user-joined", handleNewUserJoined);
      socket.on("incoming-call", handleIncomingCall);
      socket.on("call-accepted", handleCallAccepted);

      return () => {
        socket.off("user-joined", handleNewUserJoined);
        socket.off("incoming-call", handleIncomingCall);
        socket.off("call-accepted", handleCallAccepted);
      };
    }
  }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  useEffect(() => {
    if (videoRef.current && myStream) {
      videoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  return (
    <div className="room-page-container">
      <h1>RoomPage</h1>
      <button onClick={() => sendStream(myStream)}>Send My Video</button>
      <video ref={videoRef} autoPlay playsInline />
      <video ref={reometStream} autoPlay playsInline />
    </div>
  );
};

export default RoomPage;
