import Billboard from "@/components/Billboard";
import MovieList from "@/components/MovieList";
import Navbar from "@/components/Navbar";
import useCurrentUser from "@/hooks/useCurrentUser";
import useMovieList from "@/hooks/useMovieList";
import { NextPageContext } from "next";
import { getSession, signOut } from "next-auth/react";

export async function getServerSideProps(context: NextPageContext) {
  //we cannot use our serverAuth function because we are  in the client side
  const session = await getSession(context); //this will return a session object if the user is authenticated

  //if the user is not authenticated, we will redirect him to the authentication page
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
  //if the user is authenticated, we will return the session object
  return {
    props: {
      // session,
    },
  };
}

export default function Home() {
  const { data: movies = [] } = useMovieList();
  return (
    <>
      <Navbar />
      <Billboard />

      <div className="pb-40">
        <MovieList title="Trending Now" data={movies} />
      </div>
    </>
  );
}
