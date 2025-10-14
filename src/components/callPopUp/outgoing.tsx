import { User } from "@/pages/home";
import { Mic, Volume2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface OutgoingCallProps {
  contact: User | null;
  onCancel: () => void; // to cancel the outgoing call
}

export const OutgoingCallPopUp = ({ contact, onCancel }: OutgoingCallProps) => {
  const audioRefOutgoing = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (contact) {
      audioRefOutgoing.current?.play();
    } else {
      audioRefOutgoing.current?.pause();
      if (audioRefOutgoing.current) audioRefOutgoing.current.currentTime = 0;
    }
  }, [contact]);

  if (!contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <audio ref={audioRefOutgoing} src="./ringTone/incoming.mp3" loop />

      <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{contact.user_name}</h3>
        <p className="text-sm text-gray-500 mb-2">{contact.email}</p>
        <p className="text-sm text-blue-600 mb-4 animate-pulse">Ringing...</p>

        {/* Disabled icons */}
        <div className="flex justify-center gap-6 mb-4">
          <Mic className="w-6 h-6 text-gray-400 opacity-50" />
          <Volume2 className="w-6 h-6 text-gray-400 opacity-50" />
        </div>

        <div className="flex justify-center">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
