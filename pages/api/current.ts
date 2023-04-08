import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/lib/serverAuth"; //to check if user is signed in and get user object from prisma db

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //check if request method is GET
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  try {
    //get user object from prisma db
    const { currentUser } = await serverAuth(req); //we don't chack if this user exists because we already did it in serverAuth
    //return user object
    return res.status(200).json({ currentUser });
  } catch (error) {
    console.log("🚀 ~ file: current.ts:18 ~ error:", error);
    res.status(400).end();
  }
}
