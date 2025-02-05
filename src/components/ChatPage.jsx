import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import 'animate.css';
import './ChatPage.css'; // Import the CSS for scrollbar styling

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userBio, setUserBio] = useState('');
  const [userDetailsFetched, setUserDetailsFetched] = useState(false);
  const chatContainerRef = useRef(null); // For auto-scrolling

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username && !userDetailsFetched) {
      fetchUserDetails(username);
    }
  }, [userDetailsFetched]);

  useEffect(() => {
    // Auto scroll to the bottom when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchUserDetails = async (username) => {
    if (userDetailsFetched) return;

    const twitterApiKey = localStorage.getItem('twitterApiKey');
    const geminiApiKey = localStorage.getItem('geminiApiKey');

    if (!twitterApiKey || !geminiApiKey) {
      setMessages([{ text: '❌ API keys are missing. Please add them on the landing page.', sender: 'bot' }]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          message: 'start',
          twitterApiKey,
          geminiApiKey,
        }),
      });

      const data = await response.json();
      setUserBio(data.user_bio);
      setMessages((prevMessages) => [...prevMessages, { text: data.response, sender: 'bot' }]);
      setUserDetailsFetched(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setMessages((prevMessages) => [...prevMessages, { text: '❌ Error fetching user details.', sender: 'bot' }]);
    }
  };

  const handleUserMessage = async () => {
    if (!userInput || loading) return;

    setMessages((prevMessages) => [...prevMessages, { text: userInput, sender: 'user' }]);
    setLoading(true);
    setUserInput('');

    const twitterApiKey = localStorage.getItem('twitterApiKey');
    const geminiApiKey = localStorage.getItem('geminiApiKey');

    try {
      const response = await fetch(`http://localhost:8000/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: localStorage.getItem('username'),
          message: userInput,
          user_bio: userBio,
          twitterApiKey,
          geminiApiKey,
        }),
      });

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [...prevMessages, { text: '❌ Error sending message.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-transparent via-indigo-500 to-transparent text-white flex items-center justify-center">
      <div className="w-full max-w-3xl bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        {/* Chat Container with Custom Scrollbar */}
        <div ref={chatContainerRef} className="chatbox-scrollbar flex-1 p-6 overflow-y-auto h-96 space-y-4">

          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`flex items-center space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, x: msg.sender === 'user' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.sender === 'bot' ? (
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="flex-shrink-0 p-3 bg-purple-500 rounded-full"
                >
                  <FaRobot className="text-2xl text-white" />
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="flex-shrink-0 p-3 bg-blue-500 rounded-full"
                >
                  <FaUser className="text-2xl text-white" />
                </motion.div>
              )}
              <div
                className={`max-w-xs p-4 rounded-lg shadow-md transition-all transform ${
                  msg.sender === 'bot' ? 'bg-purple-600' : 'bg-blue-600'
                } text-white`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div className="flex items-center space-x-3 justify-start">
              <motion.div className="flex-shrink-0 p-3 bg-purple-500 rounded-full animate-bounce">
                <FaRobot className="text-2xl text-white" />
              </motion.div>
              <div className="max-w-xs p-3 bg-gray-700 text-white rounded-lg animate-pulse">
                Bot is typing...
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Field */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
              disabled={loading}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleUserMessage}
              className="ml-4 px-6 py-2 bg-purple-600 rounded-full text-white hover:bg-purple-500 transition-all"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
