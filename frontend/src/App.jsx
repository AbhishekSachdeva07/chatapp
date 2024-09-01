import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { io } from "socket.io-client";

function App() {
  // Initialize the socket connection only once using useMemo
  const socket = useMemo(() => io("https://chatapp-4401.onrender.com"), []);

  const [msginput, setmsginput] = useState("");
  const [msg, setmsg] = useState([]);

  useEffect(() => {
    // Setup event listeners only once when the component mounts
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server, reason:", reason);
    });

    socket.on("newuser", (data) => {
      console.log("New user joined:", data);
      setmsg((prev) => [...prev, data]);
    });

    socket.on("message", (data) => {
      console.log("Received message on client:", data);
      setmsg((prev) => [...prev, data]);
    });

    // Clean up the event listeners when the component unmounts

  }, []);  // Empty dependency array to ensure this effect runs only once

  const sendMsg = async (e) => {
    e.preventDefault();
    const messageformat = {
      type: 'user',
      message: msginput
    };
    console.log("Sending message:", messageformat);
    socket.emit('message', messageformat);
    setmsg((oldmsg) => [...oldmsg, messageformat]);
    setmsginput("");
  };

  return (
    <>
      <div className="chat-box">
        <div className="chat-box-heading">
          <span>ChatBot @codexabhishek</span>
        </div>
        <div className="chat-box-chats">
          <div className="chats-chat-box">
            {msg.map((msg, index) => (
              <div key={index} className={msg.type === 'user' ? 'user-chats' : msg.type === 'otheruser' ? 'otheruser-chats' : msg.type === 'newuser' ? 'newuser-chats' : 'defaultuser'}>
                <span>{msg.message}</span>
              </div>
            ))}
          </div>
          <div className="input-chat-box">
            <input type="text" placeholder='Enter your message here...' onChange={(e) => setmsginput(e.target.value)} value={msginput} />
            <button onClick={sendMsg}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
