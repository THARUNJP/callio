import { getSocket } from "./socket";


export const exchangeSdpOffer = (recipientId: number, offer: RTCSessionDescriptionInit) => {
  const socket = getSocket();
  try {
    socket.emit("incoming-call", { recipientId, offer });
  } catch (err) {
    console.error("Error sending SDP offer:", err);
  }
};

