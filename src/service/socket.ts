// socketService.ts
import { io, Socket } from "socket.io-client";
import { URL } from "../lib/constant/constant";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(`${URL}`, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  return socket;
};