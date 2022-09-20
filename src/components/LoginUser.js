import React, { useRef } from "react";

export const LoginUser = ({ socket }) => {
  const userNameRef = useRef();

  const handleFrom = async (e) => {
    e.preventDefault();

    socket.emit("new_visitor", {
      name: userNameRef.current.value,
    });

    localStorage?.setItem("userName", userNameRef.current.value);
  };

  return (
    <form
      onSubmit={handleFrom}
      className="w-[30%] mx-auto  shadow-lg p-8 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <label
        htmlFor="username-success"
        className="block mb-2 text-sm font-medium text-green-700 dark:text-green-500"
      >
        Your name
      </label>
      <input
        type="text"
        ref={userNameRef}
        id="username-success"
        className="bg-green-50 border border-green-500 text-green-900 placeholder-green-700 text-sm rounded-lg focus:outline-none block w-full p-2.5 dark:bg-green-100 dark:border-green-400"
        placeholder="User name"
      />

      <input
        type="submit"
        value="Submit"
        className="border px-4 py-2 mt-3 rounded-lg bg-green-500 hover:bg-green-800 hover:text-white"
      />
    </form>
  );
};
