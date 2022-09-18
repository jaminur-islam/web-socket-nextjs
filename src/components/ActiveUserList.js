import React, { useRef, useState } from "react";

export const ActiveUserList = ({
  activeUserList,
  message,
  socket,
  senderUser,
}) => {
  const [receiverUser, setReceiverUser] = useState({});
  const messageRef = useRef();

  const submitMessage = () => {
    if (receiverUser.id) {
      socket.emit("message", {
        receiverId: receiverUser.id,
        message: messageRef.current.value,
        senderId: senderUser.id,
      });
    } else {
      alert("Please select a user");
    }
  };
  return (
    <div>
      <h1 className="text-2xl ml-24"> Active users list </h1>
      <div className="grid grid-cols-2 w-[90%] gap-10 mt-10  mx-auto">
        <div className="p-4 border space-y-5">
          {activeUserList?.map((user, index) => {
            return (
              <div
                onClick={() => setReceiverUser(user)}
                key={index}
                value={user.id}
                className="border p-2 flex justify-around"
              >
                id : {user.id}
                <span>name : {user.name}</span>
              </div>
            );
          })}
        </div>

        <div>
          <h2 className="text-2xl my-3 ">Send to {receiverUser?.name}</h2>
          <input
            type="text"
            ref={messageRef}
            className="border block border-gray-600 p-2 rounded-lg w-[60%]"
          />
          <button
            onClick={submitMessage}
            className="border p-2  mt-2 bg-red-500 rounded-lg text-white"
          >
            Submit
          </button>

          <div className="p-4 border space-y-5 mt-10">
            {message.map((m, index) => {
              return (
                <div key={index} className="border p-2">
                  <div> {m} </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
