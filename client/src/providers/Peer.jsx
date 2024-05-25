import React, {
  useMemo,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const PeerContext = createContext(null);

export const PeerProvider = (props) => {
  const [reometStream, setRemoteStream] = useState(null);

  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
        ],
      }),
    []
  );

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteDescription = async (description) => {
    await peer.setRemoteDescription(description);
  };

  const sendStream = (stream) => {
    const senders = peer.getSenders();
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      const sender = senders.find(
        (s) => s.track && s.track.kind === track.kind
      );
      if (!sender) {
        peer.addTrack(track, stream);
      }
    });
  };

  const handleTrackEvent = useCallback((ev) => {
    setRemoteStream(ev.streams[0]);
  }, []);

  const handleNegotiation = useCallback(() => {
    console.log("Oops! Negotiation needed");
  }, []);

  useEffect(() => {
    peer.addEventListener("track", handleTrackEvent);
    peer.addEventListener("negotiationneeded", handleNegotiation);
    return () => {
      peer.removeEventListener("track", handleTrackEvent);
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [handleTrackEvent, handleNegotiation, peer]);

  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteDescription,
        sendStream,
        reometStream,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};

export const usePeer = () => {
  return useContext(PeerContext);
};
