import { Server } from "socket.io";

import {
  getAllUserFormDatabase,
  insertUserToDatabase,
  getUniqueUser,
  insertMessageToDatabase,
  getAllMessageFromDatabase,
} from "../../utils/dbOperation";

let user_map = new Map();
let userIsConnected = true;
const messages = [];

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.on("connection", async (socket) => {
      socket.emit("all_users", await getAllUserFormDatabase());

      socket.on("new_visitor", async (user) => {
        userIsConnected = true;
        const findUser = await getUniqueUser(user.name);

        if (findUser) {
          setToActiveList(findUser);
          const socketUserFind = user_map.get(findUser?.id);
          socketUserFind.socket = socket;
          io.emit("get_active_users", getActiveList());
          socket.userId = findUser.id;
        } else {
          let insertedUser = await insertUserToDatabase(user);
          socket.userId = insertedUser.id;
          setToActiveList(insertedUser);
          io.emit("get_active_users", getActiveList());
        }
      });

      socket.on("disconnect", () => {
        userIsConnected = false;
        setTimeout(() => {
          if (userIsConnected) {
            io.emit("get_active_users", getActiveList());
          } else {
            deleteActiveUser(socket.userId);
            io.emit("get_active_users", getActiveList());
          }
        }, 3000);
      });

      // SET SOCKET USER
      const setToActiveList = (user) => {
        user_map.set(user.id, {
          socket: socket,
          user: user,
        });
      };

      // GET TO ACTIVE LIST
      const getActiveList = () => {
        return Array.from(user_map, ([name, value]) => value.user);
      };

      // DELETE SOCKET USER
      const deleteActiveUser = (id) => {
        user_map.delete(id);
      };

      socket.on("message", async (message) => {
        const userMessage = await insertMessageToDatabase(message);
        console.log(userMessage.id);
        let receiver = user_map.get(message.receiverId).socket;
        // console.log("receiver", receiver);
        messages.push(userMessage);
        receiver.emit("message", userMessage);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
