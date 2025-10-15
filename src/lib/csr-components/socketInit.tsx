import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSocket } from "@/src/service/socket";
import { refreshToken } from "@/src/service/token";
interface SocketClientProps {
  onIncomingCall: (
    fromUserId: number,
    offer: RTCSessionDescriptionInit
  ) => void;
  onDeclindCall: () => void;
  onCallAcceptance: (recipentId:number,answer: RTCSessionDescriptionInit) => void;
}
export default function SocketClient({
  onIncomingCall,
  onDeclindCall,
  onCallAcceptance,
}: SocketClientProps) {
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();

    socket.on("auth-error", async (msg) => {
      console.log(msg, "/auth-error/msg");
      await refreshToken(router); // refresh token or redirect
    });

     const handleCallAcceptance = ({
    recipentId,
    offer,
  }: {
    recipentId: number;
    offer: RTCSessionDescriptionInit;
  }) => {
    onCallAcceptance(recipentId, offer);
  }

    socket.on("incoming-call", ({ fromSocket, fromUserId, offer }) => {
      console.log(fromSocket, fromUserId, offer);

      onIncomingCall(fromUserId, offer);
    });
    socket.on("call-declined", onDeclindCall);
    socket.on("call-acceptance", handleCallAcceptance);

    return () => {
      socket.off("auth-error");
      socket.off("call-declined", onDeclindCall);
      socket.off("incoming-call"); // cleanup listener
      socket.off("call-acceptance",handleCallAcceptance);
    };
  }, [router, onIncomingCall, onDeclindCall]);

  return null;
}
