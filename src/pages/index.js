import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";
import { AllUsers } from "../components/AllUsers";
import { ActiveUserList } from "../components/ActiveUserList";
import { LoginUser } from "../components/LoginUser";

let socket;
export default function Home() {
  // User related state
  const [activeUserList, setActiveUserList] = useState([]);
  const [allUser, setAllUsers] = useState([]);
  const [message, setMessage] = useState([]);

  // index page state
  const [activeUserName, setActiveUserName] = useState("");
  const [senderUser, setSenderUser] = useState({});

  useEffect(() => {
    socketInitializer();
    return;
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();
    socket.on("all_users", (data) => {
      // console.log(data);
      setAllUsers(data);
    });
    if (localStorage.getItem("userName")) {
      socket.emit("new_visitor", {
        name: localStorage?.getItem("userName"),
      });
    }
    socket.on("get_active_users", (activeUserList) => {
      setActiveUserList(activeUserList);
    });

    socket.on("message", (msg) => {
      setMessage((message) => [...message, msg]);
    });
  };
  const [arr, setArr] = useState([]);

  const handle = (s) => {
    setArr([...arr, s]);
  };

  // console.log(message);

  useEffect(() => {
    const senderUserFind = activeUserList.find(
      (user) => user.name === localStorage?.getItem("userName")
    );
    // console.log(senderUserFind);

    setSenderUser(senderUserFind);
    setActiveUserName(localStorage.getItem("userName"));
  }, [activeUserList]);

  const handleLogOut = () => {
    setActiveUserName("");
    localStorage.removeItem("userName");
  };

  return (
    <div>
      <Head>
        <title>{activeUserName}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="p-10 w-max ml-auto ">
        {activeUserName ? (
          <button
            className="border px-3 py-2 rounded bg-red-500 text-white"
            onClick={handleLogOut}
          >
            LogOut
          </button>
        ) : (
          <button className="border px-3 py-2 rounded bg-green-400 text-white">
            Login
          </button>
        )}
      </div>
      {activeUserName ? <AllUsers allUser={allUser} /> : null}
      {!activeUserName ? (
        <LoginUser socket={socket} setMessage={setMessage} />
      ) : (
        <ActiveUserList
          activeUserList={activeUserList}
          message={message}
          socket={socket}
          senderUser={senderUser}
        />
      )}
    </div>
  );
}
