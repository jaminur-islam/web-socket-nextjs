import { db } from "../prismaClients/prismaClients";

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

export { getAllUserFormDatabase, insertUserToDatabase, getUniqueUser };
