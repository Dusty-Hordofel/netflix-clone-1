import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import useMovie from "@/hooks/useMovie";

const Watch = () => {
  const router = useRouter();
  const { movieId } = router.query; //we get the movieId from the url

  //we use the useMovie hook to get the movie data
  const { data } = useMovie(movieId as string); //we pass the movieId to the hook
  console.log("🚀 ~ file: [movieId].tsx:12 ~ Watch ~ data:", data);

  return (
    <div className="w-screen h-screen bg-black">
      <nav className="fixed z-10 flex flex-row items-center w-full gap-8 p-4 bg-black bg-opacity-70">
        <ArrowLeftIcon
          onClick={() => router.push("/")}
          className="w-4 text-white transition cursor-pointer md:w-10 hover:opacity-80"
        />
        <p className="font-bold text-white text-1xl md:text-3xl">
          <span className="font-light">Watching:</span> {data?.title}
        </p>
      </nav>
      <video
        className="w-full h-full"
        autoPlay
        controls
        src={data?.videoUrl}
      ></video>
    </div>
  );
};

export default Watch;
