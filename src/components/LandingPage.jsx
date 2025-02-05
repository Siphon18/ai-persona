import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [twitterApiKey, setTwitterApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');

  const handleStartChatting = () => {
    localStorage.setItem('username', username);
    navigate('/chat');
  };

  const handleSaveApiKeys = () => {
    localStorage.setItem('twitterApiKey', twitterApiKey);
    localStorage.setItem('geminiApiKey', geminiApiKey);
    setIsModalOpen(false);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center relative">
      <motion.div
        className="w-full max-w-lg bg-gray-900 p-6 rounded-lg shadow-2xl text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-purple-500 animate-pulse">AI Persona</h1>
        <p className="text-lg mb-8 text-gray-300">Create new AI Twitter personalities</p>
        <motion.input
          type="text"
          placeholder="Enter Twitter username"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
          onChange={(e) => setUsername(e.target.value)}
          whileFocus={{ scale: 1.05 }}
        />
        <motion.button
          onClick={handleStartChatting}
          className="px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
          whileTap={{ scale: 0.95 }}
        >
          Create AI Persona 🚀
        </motion.button>
      </motion.div>

      {/* Add API Key Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition-all"
      >
        Add API Keys ⚙️
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-purple-500 mb-4">Enter API Keys</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Twitter API Key</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={twitterApiKey}
                onChange={(e) => setTwitterApiKey(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Gemini API Key</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKeys}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
