import axios from "axios";
import React, { useCallback, useMemo } from "react";
import { PlusIcon, CheckIcon } from "@heroicons/react/24/outline";

import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorites from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  movieId: string;
}

const FavoriteButton = ({ movieId }: FavoriteButtonProps) => {
  const { mutate: mutateFavorites } = useFavorites();

  const { data: currentUser, mutate } = useCurrentUser();
  console.log(
    "🚀 ~ file: FavoriteButton.tsx:16 ~ FavoriteButton ~ currentUser:",
    currentUser
  );

  const isFavorite = useMemo(() => {
    //assign user favoriteIds to a list variable or []
    const list = currentUser?.currentUser.favoriteIds || [];
    //verify if the movieId is in the list
    return list.includes(movieId);
  }, [currentUser, movieId]);

  const toggleFavorites = useCallback(async () => {
    let response;

    //if the movieId is in the list:
    if (isFavorite) {
      //delete the movieId from the list
      response = await axios.delete("/api/favorite", { data: { movieId } }); //in axios we have to add the data object to the delete request
      console.log(
        "🚀 ~ file: FavoriteButton.tsx:34 ~ toggleFavorites ~ response:",
        response
      );
    } else {
      //add the movieId to the list
      response = await axios.post("/api/favorite", { movieId }); //in axios we haven't to add the data object to the post request
      console.log(
        "🚀 ~ file: FavoriteButton.tsx:37 ~ toggleFavorites ~ response:",
        response
      );
    }

    const updatedFavoriteIds = response?.data?.favoriteIds;
    //update the currentUser object with the new list
    mutate({
      ...currentUser,
      favoriteIds: updatedFavoriteIds,
    });
    mutateFavorites();
  }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

  const Icon = isFavorite ? CheckIcon : PlusIcon;

  return (
    <div
      onClick={toggleFavorites}
      className="flex items-center justify-center w-6 h-6 transition border-2 border-white rounded-full cursor-pointer group/item lg:w-10 lg:h-10 hover:border-neutral-300"
    >
      <Icon className="w-4 text-white group-hover/item:text-neutral-300 lg:w-6" />
    </div>
  );
};

export default FavoriteButton;
