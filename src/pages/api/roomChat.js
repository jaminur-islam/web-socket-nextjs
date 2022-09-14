import { Server } from "socket.io";

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      console.log("user connect");
      socket.on("disconnect", () => {
        console.log("user disconnect");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }

  const io = res.socket.server.io;
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
