import React, { useEffect } from "react";
import { io } from "socket.io-client";

let socket;
const roomChat = () => {
  useEffect(() => {
    socketInitializer();
    return;
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/roomChat");
    socket = io();
  };
  return <div>roomChat</div>;
};

export default roomChat;
