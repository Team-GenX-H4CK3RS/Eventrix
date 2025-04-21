"use client";
import { useState } from "react";

const sampleMessages = [
  {
    id: 1,
    sender: "Alice",
    message: "Hey, are we still on for tonight?",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "Bob",
    message: "Yes, absolutely! I will be there at 7.",
    time: "10:35 AM",
  },
  {
    id: 3,
    sender: "Alice",
    message: "Great! Looking forward to it.",
    time: "10:40 AM",
  },
  {
    id: 4,
    sender: "Charlie",
    message: "Can you send me the address again?",
    time: "11:00 AM",
  },
  {
    id: 5,
    sender: "Bob",
    message: "Sure, I will send it over shortly.",
    time: "11:05 AM",
  },
];

const channels = [
  {
    id: 1,
    name: "Announcements",
    messages: sampleMessages.slice(0, 3),
  },
  {
    id: 2,
    name: "General",
    messages: sampleMessages.slice(3, 5),
  },
];

const Main = () => {
  const [selectedChannel, setSelectedChannel] = useState<any>(channels[0]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-300 bg-gray-100 p-4">
        <h3 className="mb-6 text-lg font-semibold">Channels</h3>
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="cursor-pointer rounded p-2 hover:bg-gray-200"
            onClick={() => setSelectedChannel(channel)}
          >
            <p>{channel.name}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex flex-1 flex-col bg-white p-6">
        <div className="mb-4 border-b border-gray-300 pb-4">
          <h2 className="text-xl font-semibold">{selectedChannel.name}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {selectedChannel.messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="mb-2 flex justify-between text-sm text-gray-500">
                <strong>{message.sender}</strong>
                <span>{message.time}</span>
              </div>
              <p className="text-gray-800">{message.message}</p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="mt-4">
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
