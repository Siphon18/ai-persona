import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleStartChatting = () => {
    // Store the username in local storage or state for further use
    localStorage.setItem('username', username);
    navigate('/chat');
  };

  return (
    <div className="h-screen bg-gradient-to-r from-blue-900 to-purple-800 text-white flex flex-col items-center justify-center dark:bg-gray-900 dark:text-white">
      <h1 className="text-5xl font-bold mb-6 animate__animated animate__fadeIn">AI Persona</h1>
      <p className="text-lg mb-8 animate__animated animate__fadeIn animate__delay-1s">Create new AI Twitter personalities</p>
      <input
        type="text"
        placeholder="Enter Twitter username"
        className="px-4 py-2 rounded-lg bg-gray-800 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        onClick={handleStartChatting}
        className="px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Create AI Persona 🚀
      </button>
    </div>
  );
};

export default LandingPage;
