import { getSocket } from "./socket";

export const handleIncomingCallDecline = (callerId: number) => {
  const socket = getSocket();
  socket.emit("call-rejection", {
    callerId,
    timestamp: Date.now(),
  });
  // socket.emit()
};

export const handleCallAcceptance = (callerId: number) => {
  const socket = getSocket();

  socket.emit("call-acceptance", {
    callerId,
    timestamp: Date.now(),
  });
};


