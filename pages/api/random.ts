import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth"; //to check if user is logged in or to authenticate our route

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    await serverAuth(req); //to check if user is logged in , here we don't retrieve the user because it's return it
    const movieCount = await prisma.movie.count(); //to get the total number of movies
    const randomIndex = Math.floor(Math.random() * movieCount); //to get a random number between 0 and the total number of movies
    const randomMovies = await prisma.movie.findMany({
      take: 1,
      skip: randomIndex,
    }); //to get 1  movie

    res.status(200).json(randomMovies[0]);
  } catch (error) {
    console.log("🚀 ~ file: random.ts:13 ~ error:", error);
    res.status(500).end();
  }
}
