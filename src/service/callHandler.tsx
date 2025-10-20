import { getSocket } from "./socket";

export const handleIncomingCallDecline = (callerId: number) => {
  const socket = getSocket();
  socket.emit("call-rejection", {
    callerId,
    timestamp: Date.now(),
  });
  // socket.emit()
};

export const handleCallAcceptance = async (
  callerId: number,
  offer: RTCSessionDescriptionInit
) => {
  try {
    console.log("offer view",offer,122323);
    
    const pc = new RTCPeerConnection();

// emit ICE candiate
   pc.onicecandidate = (event) => {
        if (event?.candidate) {
          const socket = getSocket();
          socket.emit("ice-canditate", {
            canditate: event?.candidate,
            targetUserId:callerId,
          });
        }
      };

     await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
     await  pc.setLocalDescription(answer);

    const socket = getSocket();

    socket.emit("call-acceptance", {
      callerId,
      answer:pc.localDescription,
    });
  } catch (err) {
    console.log(err,"err");
    
  }
};




