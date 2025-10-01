import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSocket } from "@/src/service/socket";
import { refreshToken } from "@/src/service/token";
interface SocketClientProps {
  onIncomingCall: (fromUserId: number, offer: RTCSessionDescriptionInit) => void;
  onDeclindCall:()=>void;
}
export default function SocketClient({onIncomingCall,onDeclindCall}:SocketClientProps) {
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
    socket.on("call-declined",()=>{
console.log("Your call has been rejected");
onDeclindCall()

    })

    return () => {
      socket.off("auth-error"); // cleanup listener
    };
  }, [router,onIncomingCall,onDeclindCall]);

  return null;
}
