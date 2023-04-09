import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //limit the request to GET only
    if (req.method !== "GET") {
      return res.status(405).end();
    }
    //check if the user is logged in
    await serverAuth(req);

    //in Nextjs when we define a route like this [movieId].ts we can access the movieId using req.query.movieId
    const { movieId } = req.query;

    //if the movieId is not a string throw an error
    if (typeof movieId !== "string") {
      throw new Error("Invalid Id");
    }
    //if the movieId is empty throw an error
    if (!movieId) {
      throw new Error("Missing Id");
    }
    //find the movie in the database using the movie id
    const movies = await prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });
    //return the movie
    return res.status(200).json(movies);
  } catch (error) {
    console.log("🚀 ~ file: movieId.ts:37 ~ error:", error);
    return res.status(500).end();
  }
}
