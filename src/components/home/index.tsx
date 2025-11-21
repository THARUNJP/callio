import { useEffect, useRef, useState } from "react";
import { Phone, Video, Search } from "lucide-react";
import { HomeProps, User } from "@/pages/home";
import SocketClient from "@/src/lib/csr-components/socketInit";
import { exchangeSdpOffer } from "@/src/service/audioClient";
import { IncomingCallPopUp } from "../callPopUp/incoming";
import { OutgoingCallPopUp } from "../callPopUp/outgoing";
import { toast } from "react-toastify";
import { handleIncomingCallDecline } from "@/src/service/callHandler";
import { getSocket } from "@/src/service/socket";

export default function ContactsGrid({ users }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [incomingCall, setIncomingCall] = useState<User | null>(null);
  const [outGoingCall, setOutGoingCall] = useState<User | null>(null);
  const [callConnected, setCallConnected] = useState<boolean>(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const outGoingCallAudioRef = useRef<MediaStream|null>(null);
  const incomingCallAudioRef = useRef<MediaStream|null>(null);

  // Filter contacts based on search term

  useEffect(() => {
    // No outgoing or incoming call? Do nothing
    if (!outGoingCall && !incomingCall) return;

    // Outgoing call timeout
    let outgoingTimeout: NodeJS.Timeout | null = null;
    if (outGoingCall && !callConnected) {
      outgoingTimeout = setTimeout(() => {
        setCallConnected((connectedNow) => {
         
          if (!connectedNow) {
            toast.error(`${outGoingCall.user_name} did not pick up your call.`);
            setOutGoingCall(null);
          }
          return connectedNow;
        });
      }, 8000); // 8s
    }

    // Incoming call timeout
    let incomingTimeout: NodeJS.Timeout | null = null;
    if (incomingCall && !callConnected) {
      incomingTimeout = setTimeout(() => {
        setCallConnected((connectedNow) => {
          if (!connectedNow) {
            toast.info(`You missed a call from ${incomingCall.user_name}.`);
            setIncomingCall(null);
          }
          return connectedNow;
        });
      }, 8000); // 8s
    }

    // Cleanup function to cancel timeouts if calls are answered/canceled
    return () => {
      if (outgoingTimeout) clearTimeout(outgoingTimeout);
      if (incomingTimeout) clearTimeout(incomingTimeout);
      setCallConnected(false);
    };
  }, [outGoingCall, incomingCall]);

  const onCallAcceptance = async (
    recipentId: number,
    answer: RTCSessionDescriptionInit
  ) => {
    const pc = peerConnectionRef.current;
    await pc?.setRemoteDescription(new RTCSessionDescription(answer));
    setCallConnected(true);
    console.log("Call accepted by", recipentId, answer);
  };
  const handleCallAcceptance = async (
    callerId: number,
    offer: RTCSessionDescriptionInit
  ) => {
    try {
      const socket = getSocket();
      console.log("offer view", offer, 122323);

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerConnectionRef.current = pc;
      // emit ICE candiate
    
      pc.ontrack = (event) => {
        const src = event.streams[0];
      incomingCallAudioRef.current = src;
        // need to pass to the outgoing call comp to render
  console.log("REMOTE TRACK RECEIVED!!!!", event.streams[0]);
   };
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      pc.ondatachannel = (ev) => {
        const channel = ev.channel;
        channel.onmessage = (msg) => console.log("Got message:", msg.data);
      };
      pc.ontrack = (event)=>{
        console.log(event,"???");
        
      }
      pc.onicecandidate = (event) => {
        // console.log("ice......reciver",event.candidate);

        if (event?.candidate) {
          console.log("Calls in dlksmkf", callerId);

          socket.emit("ice-candidate", {
            candidate: event?.candidate,
            targetUserId: callerId,
          });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      // await pc.createDataChannel("signal")
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("call-acceptance", {
        callerId,
        answer: pc.localDescription,
      });
    } catch (err) {
      console.log(err, "err");
    }
  };

  const onICECandidate = async (candidate: RTCIceCandidateInit) => {
    console.log(callConnected,"??//?? caller side");
    setCallConnected(true)
    
    try {
      if (peerConnectionRef?.current) {
        await peerConnectionRef.current?.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } else {
        console.warn("no peer connection ref found");
      }
    } catch (err) {
      console.warn("err in ice excahnge", err);
    }
  };
  const filteredContacts = users.filter(
    (contact) =>
      contact.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const onIncomingCall = (
    fromUserId: number,
    offer: RTCSessionDescriptionInit
  ) => {
    console.log(offer);
    const user = users.find((e) => e.user_id === fromUserId) || null;
    if (user) user.offer = offer;
    setIncomingCall(user);
  };

  const handleAudioCall = async (contact: User) => {
    console.log("Audio call to:", contact);

    try {
      const socket = getSocket();
      // Get microphone access

      
      // Create a new peer connection for this call

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = pc;
         pc.ontrack = (event)=>{
      const src = event.streams[0];
      outGoingCallAudioRef.current = src;
        
      }
      const dc = pc.createDataChannel("signal");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track)=>pc.addTrack(track,stream));
      pc.onicecandidate = (event) => {
        // console.log("ice......caller...",event.candidate);

        if (event?.candidate) {
          console.log("Calls in dlksmkf", contact?.user_id);

          socket.emit("ice-candidate", {
            candidate: event.candidate,
            targetUserId: contact?.user_id, // or outGoingCall?.user_id on caller side
          });
        }
      };

      // Add local audio tracks to the peer connection
      // stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Generate an SDP offer describing our media and connection info
      const offer = await pc.createOffer();

      // Set the offer as local description so the connection knows our intent
      await pc.setLocalDescription(offer);
      exchangeSdpOffer(contact.user_id, offer);
      setOutGoingCall(contact);

      // TODO: send offer via signaling server to the remote peer
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        // User denied microphone access
        alert(
          "Microphone access denied. Please enable it in your browser settings."
        );
      }
    }
  };

  const handelDeclinedCall = () => {
    console.log(1);

    if (outGoingCall) {
      const declinedUserName = outGoingCall.user_name;
      console.log(outGoingCall, "/");

      toast.error(`The call has been declined by ${declinedUserName}`);
      setOutGoingCall(null);
    }
    if (incomingCall) {
      const declinedUserName = incomingCall.user_name;
      console.log(outGoingCall, "/");

      toast.error(`The call has been ended by ${declinedUserName}`);
      setIncomingCall(null);
    }
  };

  const handleVideoCall = (contact: User) => {
    console.log("Video call to:", contact);
    // Add your video call logic here
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <SocketClient
        onIncomingCall={onIncomingCall}
        onDeclindCall={handelDeclinedCall}
        onCallAcceptance={onCallAcceptance}
        onICECandidate={onICECandidate}
      />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.user_id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {contact.user_name}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {contact.email}
                </p>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleAudioCall(contact)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  title="Audio Call"
                >
                  <Phone className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleVideoCall(contact)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Video Call"
                >
                  <Video className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No contacts found matching {searchTerm}
          </p>
        </div>
      )}

      {/* Outgoing Call Popup */}
      <OutgoingCallPopUp
        contact={outGoingCall}
        audioStream={outGoingCallAudioRef.current}
        onCancel={() => {
          outGoingCall && handleIncomingCallDecline(outGoingCall?.user_id);
          setOutGoingCall(null);
        }}
        callConnected={callConnected}
      />

      {/* Incoming Call Popup */}
      <IncomingCallPopUp
        incomingCall={incomingCall}
        onAccept={() => {
          if (incomingCall && incomingCall?.offer) {
            handleCallAcceptance(incomingCall?.user_id, incomingCall?.offer);
          } else {
            console.log("no sdp offer is avilable");
          }
          // Accept call logic here
          // setIncomingCall(null);
        }}
        onDecline={() => {
          incomingCall && handleIncomingCallDecline(incomingCall?.user_id);
          setIncomingCall(null);
        }}
      />
    </div>
  );
}