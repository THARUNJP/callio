import { User } from "@/pages/home";
import { useEffect, useRef } from "react";

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
  useEffect(() => {
    if (incomingCall) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
    }
  }, [incomingCall]);

  if (!incomingCall) return;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <audio ref={audioRef} src="./ringTone/incoming.mp3" loop/>
      <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
        <h3 className="text-lg font-semibold mb-2">
          {incomingCall?.user_name}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{incomingCall?.email}</p>
        <div className="flex justify-around mt-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={onAccept} // accept call
          >
            Accept
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={onDecline} // Reject call
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};
