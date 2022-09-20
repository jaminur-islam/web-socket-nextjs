import { db } from "../prismaClients/prismaClients";
//==============================================  USER OPERATION ========================================================//
// SET USER LIST FORM DB
const insertUserToDatabase = async (user) => {
  const newUser = await db.user.create({
    data: {
      name: user.name,
    },
  });
  return newUser;
};

// GET USER LIST FORM DB
const getAllUserFormDatabase = async () => {
  const user_list = await db.user.findMany();
  return user_list;
};

// GET UNIQUE USER FORM DATABASE
const getUniqueUser = async (name) => {
  const uniqueUser = await db.user.findUnique({
    where: {
      name,
    },
  });
  return uniqueUser;
};
//============================================== MESSAGE OPERATION ========================================================//
// SET MESSAGE TO DATABASE
const insertMessageToDatabase = async (message) => {
  const userMessage = await db.message.create({
    data: message,
  });
  return userMessage;
};

// GET ALL MESSAGE FROM DATABASE
const getAllMessageFromDatabase = async (id) => {
  const allMessage = await db.message.findMany({
    where: {
      receiverId: id,
    },
    include: {
      receiver: true,
      sender: true,
    },
  });
  return allMessage;
};

export {
  getAllUserFormDatabase,
  insertUserToDatabase,
  getUniqueUser,
  insertMessageToDatabase,
  getAllMessageFromDatabase,
};
