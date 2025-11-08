import { User } from "@/pages/home";
import { Mic, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IncomingCallProps {
  incomingCall: User | null;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCallPopUp = ({
  incomingCall,
  onAccept,
  onDecline,
}: IncomingCallProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [callConnected, setCallConnected] = useState<boolean>(false);
  useEffect(() => {
    if (incomingCall) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
    }
    return ()=>{
setCallConnected(false)
    } 
  }, [incomingCall]);

  function handleAcceptEvent() {
    audioRef.current = null;
    setCallConnected(true);
    onAccept();
  }

  if (!incomingCall) return;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Ringing sound */}
      <audio ref={audioRef} src="/ringTone/incoming.mp3" loop autoPlay />

      <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
        <h3 className="text-lg font-semibold mb-2">
          {incomingCall?.user_name}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{incomingCall?.email}</p>

        {callConnected ? (
          <div className="flex justify-center gap-6 mb-4">
          <Mic className="w-6 h-6 text-gray-400 opacity-50" />
          <Volume2 className="w-6 h-6 text-gray-400 opacity-50" />
        </div>
        ) : (
          <div className="flex justify-around mt-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={handleAcceptEvent} //  accept call
            >
              Accept
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={onDecline} //  reject call
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
