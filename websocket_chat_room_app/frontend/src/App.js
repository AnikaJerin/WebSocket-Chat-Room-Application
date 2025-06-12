import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css'; // Import external CSS

const socket = io('http://localhost:5001');

function App() {
  const [username, joinChat] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on('message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter your username first.');
      return;
    }
    if (message.trim()) {
      socket.send({ username, text: message });
      setMessage('');
    }
  };

  const handleJoinChat = (e) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      joinChat(tempUsername.trim());
    }
  };

  return (
    <div className="container">
      <h2 className="header">Chat Room</h2>

      {!username ? (
        <form onSubmit={handleJoinChat} className="usernameForm">
          <input
            type="text"
            placeholder="Enter your username"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            className="usernameInput"
          />
          <button type="submit" className="usernameButton">Join</button>
        </form>
      ) : (
        <>
          <div className="chatBox">
            {chat.map((msg, idx) => (
              <div key={idx} className="messageContainer">
                <div className="usernameLabel">{msg.username || 'Anonymous'}</div>
                <div className="messageText">{msg.text || msg}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="form">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
              className="input"
              autoFocus
            />
            <button type="submit" className="button">Send</button>
          </form>
        </>
      )}
    </div>
  );
}

export default App;
