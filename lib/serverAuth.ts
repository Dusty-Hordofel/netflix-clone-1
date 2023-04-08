import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prismadb from "@/lib/prismadb";

//NB: we are going to use that to check if user is signed in and get user object from prisma db
//receive api request and return user object
const serverAuth = async (req: NextApiRequest) => {
  //get session from next-auth client, receive user object
  const session = await getSession({ req }); //we use session to get other fields from user object (fields are defined in prisma schema)

  //check if session exists
  if (!session?.user?.email) {
    throw new Error("Not signed in");
  }

  //get user from prisma db
  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  //check if user exists
  if (!currentUser) {
    throw new Error("Not signed in");
  }

  //return user object
  return { currentUser };
};

export default serverAuth;
