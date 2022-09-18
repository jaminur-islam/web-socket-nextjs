import React from "react";

export const AllUsers = ({ allUser }) => {
  return (
    <div className="text-center">
      <h3 className="text-2xl">All users list </h3>
      {allUser.map((user, index) => {
        return (
          <div
            key={index}
            className="flex border mx-auto w-[20%] justify-between p-2 mt-5"
          >
            <div>{user.name}</div>
            <div>{user.id}</div>
          </div>
        );
      })}
    </div>
  );
};
