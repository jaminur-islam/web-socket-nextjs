import { Server } from "socket.io";
import os from "os";
const username = os.userInfo().username;
let count = 0;
let user_map = new Map();
const ioHandler = (req, res) => {
  /* const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress; */

  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      // socket.broadcast.emit("a user connected");

      console.log("Active user: " + ++count);
      socket.on("new_visitor", (user) => {
        io.emit("get_users", getUser(user));
      });

      /*   socket.on("join_room", (room) => {
        socket.join(room);
      });

      socket.on("message", ({ room, message }) => {
        socket.to(room).emit("message", {
          message,
          name: "Friend",
        });
      }); */

      socket.on("disconnect", () => {
        console.log("a user disconnected");
        console.log("Active user: " + --count);
        io.emit("get_users", getUser(null, socket.id));
      });
      // SET USER AND DELETE USER
      const getUser = (user, id) => {
        let user_array;
        if (id) {
          user_map.delete(id);
          user_array = Array.from(user_map, ([name, value]) => value);
          io.emit("get_users", user_array);
        } else {
          user.id = socket.id;
          user.username = username;
          user_map.set(socket.id, user);
          user_array = Array.from(user_map, ([name, value]) => value);
        }
        return user_array;
      };
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
