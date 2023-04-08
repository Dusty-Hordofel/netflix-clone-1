import useCurrentUser from "@/hooks/useCurrentUser";
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
  //fetch user using useCurrentUser hook
  const { data: user } = useCurrentUser(); //this will return a user object if the user is authenticated
  console.log("🚀 ~ file: index.tsx:29 ~ Home ~ user:", user?.currentUser.name);

  return (
    <>
      <h1 className="text-amber-400 text-bold ">Netflix clone</h1>
      <p className="text-white">Logged in as : {user?.currentUser.name}</p>
      <button className="w-full h-10 bg-white" onClick={() => signOut()}>
        Logout!
      </button>
    </>
  );
}
