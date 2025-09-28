import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSocket } from "@/src/service/socket";
import { refreshToken } from "@/src/service/token";

export default function SocketClient() {
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();

    socket.on("auth-error", async (msg) => {
      console.log(msg, "/auth-error/msg");
      await refreshToken(router); // refresh token or redirect
    });

    return () => {
      socket.off("auth-error"); // cleanup listener
    };
  }, [router]);

  return null;
}
