import React, { useState, useEffect } from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userBio, setUserBio] = useState('');
  const [userDetailsFetched, setUserDetailsFetched] = useState(false);

  useEffect(() => {
    console.log('useEffect called');
    const username = localStorage.getItem('username');
    if (username && !userDetailsFetched) {
      console.log("Fetching user details for:", username);
      fetchUserDetails(username);
    }
  }, [userDetailsFetched]); // Empty dependency array ensures useEffect runs only once

  const fetchUserDetails = async (username) => {
    if (userDetailsFetched) {
      console.log("User details already fetched, skipping API call.");
      return;
    }
    try {
      console.log("Calling API to fetch user details...");
      const response = await fetch(`http://localhost:8000/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, message: 'start' })
      });
      const data = await response.json();
      console.log("Received user details:", data);
      setUserBio(data.user_bio);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, sender: 'bot' },
      ]);
      setUserDetailsFetched(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleUserMessage = async () => {
    if (!userInput) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userInput, sender: 'user' },
    ]);
    setLoading(true);
    setUserInput('');

    try {
      const response = await fetch(`http://localhost:8000/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: localStorage.getItem('username'), message: userInput, user_bio: userBio })
      });
      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, sender: 'bot' },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-800 text-white flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`flex items-center space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {msg.sender === 'bot' ? (
                <FaRobot className="text-2xl text-purple-500" />
              ) : (
                <FaUser className="text-2xl text-blue-500" />
              )}
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.sender === 'bot' ? 'bg-purple-600' : 'bg-blue-600'
                } text-white`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex items-center space-x-3 justify-start animate__animated animate__fadeIn animate__delay-1s">
              <FaRobot className="text-2xl text-purple-500" />
              <div className="max-w-xs p-3 bg-gray-700 text-white rounded-lg">
                <div className="animate-pulse">Bot is typing...</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-900">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
          />
          <button
            onClick={handleUserMessage}
            className="ml-4 px-6 py-2 bg-purple-600 rounded-full text-white hover:bg-purple-500 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
