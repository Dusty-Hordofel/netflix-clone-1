import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { currentUser } = await serverAuth(req); //to check if user is logged in , here we don't retrieve the user because it's return it

      const { movieId } = req.body; //to get the movie id from the body

      //find the movie in the database using the movie id
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });
      //throw an error if the movie id is invalid
      if (!existingMovie) {
        throw new Error("Invalid ID");
      }
      //to update the user favoriteIds. we have a favoriteIds field in the user model witch is an array of strings
      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          favoriteIds: {
            push: movieId,
          },
        },
      });
      //return the updated user
      return res.status(200).json(user);
    }

    if (req.method === "DELETE") {
      const { currentUser } = await serverAuth(req);

      //to get the movie id from the body
      const { movieId } = req.body;

      //find the movie in the database using the movie id
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });
      //throw an error if the movie id is invalid
      if (!existingMovie) {
        throw new Error("Invalid ID");
      }
      //update the user List of favoriteIds
      const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);
      //update the user after removing the movie id from the favoriteIds array
      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          favoriteIds: updatedFavoriteIds,
        },
      });
      //return the updated user
      return res.status(200).json(updatedUser);
    }
    //if the request method is not POST or DELETE return an error
    return res.status(405).end();
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}
