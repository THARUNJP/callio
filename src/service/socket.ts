// socketService.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:8000", { withCredentials: true });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return socket;
};
