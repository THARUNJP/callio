import {useState } from 'react';
import { Phone, Video, Search } from 'lucide-react';
import { HomeProps, User } from '@/pages/home';
import SocketClient from '@/src/lib/csr-components/socketInit';
import { handleAudioCall } from '@/src/service/audioClient';

export default function ContactsGrid({users}:HomeProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter contacts based on search term
  const filteredContacts = users.filter(contact =>
    contact.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const handleVideoCall = (contact: User) => {
    console.log('Video call to:', contact);
    // Add your video call logic here
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <SocketClient />
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
        {filteredContacts.map(contact => (
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
          <p className="text-gray-500">No contacts found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}


