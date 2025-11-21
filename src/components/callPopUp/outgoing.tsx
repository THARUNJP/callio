import { User } from "@/pages/home";
import UsePermission from "@/src/hooks/usePermission";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface OutgoingCallProps {
  contact: User | null;
  callConnected: boolean;
  onCancel: () => void; // to cancel the outgoing call
  audioStream: MediaStream | null;
}

export const OutgoingCallPopUp = ({
  contact,
  onCancel,
  callConnected,
  audioStream,
}: OutgoingCallProps) => {
  const audioRefOutgoing = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const microphoneRef = UsePermission("microphone");

  useEffect(() => {
    if (contact) {
      audioRefOutgoing.current?.play();
      // getMicroPhoneStatus();
    } else {
      audioRefOutgoing.current?.pause();
      if (audioRefOutgoing.current) audioRefOutgoing.current.currentTime = 0;
    }

    // return () => {
    //   // microphoneRef = false;
    // };
  }, [contact]);

  // async function getMicroPhoneStatus() {

  // }
  useEffect(() => {
    if (audioStream && remoteAudioRef?.current) {
      remoteAudioRef.current.srcObject = audioStream;
      remoteAudioRef.current.play().catch((err) => {
        console.log(err, "err in playing the audio");
      });
    }
  }, [audioStream]);
  useEffect(() => {
    if (callConnected) {
      audioRefOutgoing.current?.pause();
      if (audioRefOutgoing.current) audioRefOutgoing.current.currentTime = 0;
    }
  }, [callConnected]);

  if (!contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <audio ref={audioRefOutgoing} src="./ringTone/incoming.mp3" loop />

      {/* Incoming remote audio stream */}
      <audio ref={remoteAudioRef} autoPlay playsInline />
      <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{contact.user_name}</h3>
        <p className="text-sm text-gray-500 mb-2">{contact.email}</p>
        {!callConnected && (
          <p className="text-sm text-blue-600 mb-4 animate-pulse">Ringing...</p>
        )}

        {/* Disabled icons */}
        <div className="flex justify-center gap-6 mb-4">
          {microphoneRef === "granted" ? (
            <Mic className="w-6 h-6 text-gray-400 opacity-50" />
          ) : (
            <MicOff className="w-6 h-6 text-gray-400 opacity-50" />
          )}
          <Volume2 className="w-6 h-6 text-gray-400 opacity-50" />
        </div>

        <div className="flex justify-center">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            onClick={onCancel}
          >
            {callConnected ? "End" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};
