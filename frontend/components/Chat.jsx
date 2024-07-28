import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const Chat = ({ user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.off("chatMessage");
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const msg = { user, text: message };
    socket.emit("chatMessage", msg);
    setMessage("");
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4  rounded-lg bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition duration-300 ease-in-out focus:outline-none z-50"
      >
        {isOpen ? "Close Chat" : "Open Chat"}
      </button>
      {isOpen && (
        <div className="fixed bottom-4 right-4  inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-40">
          <div className="bg-white text-black rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-300 flex justify-between items-center">
              <h2 className="text-lg font-bold">Chat</h2>
              <button onClick={toggleChat} className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out">
                &times;
              </button>
            </div>
            <div className="p-4 h-64 overflow-y-scroll">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong className="text-black">{msg.user}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex p-2 border-t border-gray-300">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow p-2 bg-gray-100 text-black rounded-l-lg focus:outline-none"
                placeholder="Type a message..."
              />
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-r-lg transition duration-300 ease-in-out">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
