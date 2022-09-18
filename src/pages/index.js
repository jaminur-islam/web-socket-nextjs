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
      console.log(data);
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
  };

  return (
    <div>
      <Head>
        <title>{activeUserName}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {activeUserName ? <AllUsers allUser={allUser} /> : null}
      {!activeUserName ? (
        <LoginUser
          socket={socket}
          setActiveUserList={setActiveUserList}
          activeUserList={activeUserList}
          setActiveUserName={setActiveUserName}
          setMessage={setMessage}
          setSenderUser={setSenderUser}
        />
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
