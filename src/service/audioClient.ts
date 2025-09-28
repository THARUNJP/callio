import { User } from "@/pages/home";
import { getSocket } from "./socket";

export const handleAudioCall = async (contact: User) => {
  console.log("Audio call to:", contact);

  try {
    // Get microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create a new peer connection for this call
    const pc = new RTCPeerConnection();

    // Add local audio tracks to the peer connection
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // Generate an SDP offer describing our media and connection info
    const offer = await pc.createOffer();

    // Set the offer as local description so the connection knows our intent
    await pc.setLocalDescription(offer);
  await exchangeSdpOffer(contact.user_id,offer)
    

    // TODO: send offer via signaling server to the remote peer
  } catch (err) {
    if (err instanceof DOMException && err.name === "NotAllowedError") {
      // User denied microphone access
      alert(
        "Microphone access denied. Please enable it in your browser settings."
      );
    }
  }
};



export const exchangeSdpOffer = (recipientId: number, offer: RTCSessionDescriptionInit) => {
  const socket = getSocket();
  try {
    socket.emit("incoming-call", { recipientId, offer });
  } catch (err) {
    console.error("Error sending SDP offer:", err);
  }
};

