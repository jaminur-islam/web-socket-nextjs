import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

let socket;
export default function Home() {
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const inputRef = useRef();

  useEffect(() => {
    socketInitializer();
    return;
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");

    socket = io();
    socket.on("get_users", (data) => {
      setUsers(data);
    });

    socket.on("message", (data) => {
      console.log("message", data);
    });
    const res = await fetch("http://geoplugin.net/json.gp");
    const data = await res.json();
    setUserDetails(data);
    // const res2 = await fetch("https://www.iplocate.io/api/lookup/202.91.42.38");

    const {
      geoplugin_city,
      geoplugin_countryName,
      geoplugin_request,
      geoplugin_region,
    } = data;

    socket.emit("new_visitor", {
      ip: geoplugin_request,
      country: geoplugin_countryName,
      city: geoplugin_city,
      division: geoplugin_region,
    });
  };

  const joinRoom = () => {
    socket.emit("join_room", "react_room");
  };

  const sendMessage = () => {
    socket.emit("message", { room: "react_room", message: "hi react room " });
  };

  return (
    <div>
      <button
        className="border p-3 block bg-green-400 rounded-lg"
        onClick={joinRoom}
      >
        Join React Room
      </button>
      <button
        className="border p-3 block bg-green-400 rounded-lg"
        onClick={sendMessage}
      >
        send Hi message react room
      </button>
      <a
        href="https://www.latlong.net/c/?lat=23.875854&long=90.379547"
        target="_blank"
      >
        {/*   <iframe
          width="100%"
          height="500px"
          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Rosemont+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          frameborder="0"
          allowFullScreen
        ></iframe> */}
        (23.875854, 90.379547)
      </a>
      <div className=" w-[90%] mx-auto   mt-10 p-1 rounded-lg space-y-5">
        {users.map((user, index) => {
          return (
            <ul
              key={index}
              className="grid grid-cols-7 border border-black p-5"
            >
              <li>{++index}</li>
              <li>{user.username}</li>
              <li>{user.id}</li>
              <li>{user.ip}</li>
              <img
                src={`https://flagcdn.com/32x24/${userDetails.geoplugin_countryCode?.toLowerCase()}.png`}
                alt=""
              />
              <li>{user.city}</li>
              <li>{user.division}</li>
            </ul>
          );
        })}
      </div>

      <div className="flex justify-center mt-10">
        <input
          className="border border-black p-3 rounded-left block focus:outline-none rounded-l"
          type="text"
          ref={inputRef}
        />

        <button className="border  border-r-1 border-l-0 border-black p-2 bg-red-500 text-white rounded-r">
          Submit
        </button>
      </div>
    </div>
  );
}
