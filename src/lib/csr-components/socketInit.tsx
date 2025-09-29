import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSocket } from "@/src/service/socket";
import { refreshToken } from "@/src/service/token";
import { User } from "@/pages/home";
interface SocketClientProps {
  onIncomingCall: (fromUserId: number, offer: RTCSessionDescriptionInit) => void;
}
export default function SocketClient({onIncomingCall}:SocketClientProps) {
  const router = useRouter();


  useEffect(() => {
    const socket = getSocket();

    socket.on("auth-error", async (msg) => {
      console.log(msg, "/auth-error/msg");
      await refreshToken(router); // refresh token or redirect
    });

    socket.on("incoming-call",({fromSocket,fromUserId,offer})=>{
      console.log(fromSocket,fromUserId,offer);
      
      onIncomingCall(fromUserId,offer)
      
    })

    return () => {
      socket.off("auth-error"); // cleanup listener
    };
  }, [router]);

  return null;
}
