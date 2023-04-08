import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //limit to POST requests
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    //get the user's name, email and password from the request body
    const { email, name, password } = req.body;
    //check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    //if user already exists, return an appropriate error message
    if (existingUser) {
      return res.status(402).json({ message: "User already exists" });
    }
    //if user doesn't exist, hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    //create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: "",
        emailVerified: new Date(),
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
