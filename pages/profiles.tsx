import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";

import useCurrentUser from "@/hooks/useCurrentUser";

const images = [
  "/images/default-blue.png",
  "/images/default-red.png",
  "/images/default-slate.png",
  "/images/default-green.png",
];

interface UserCardProps {
  name: string;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const UserCard: React.FC<UserCardProps> = ({ name }) => {
  const imgSrc = images[Math.floor(Math.random() * 4)];

  return (
    <div className="flex-row mx-auto group w-44">
      <div className="flex items-center justify-center overflow-hidden border-2 border-transparent rounded-md w-44 h-44 group-hover:cursor-pointer group-hover:border-white">
        <img
          draggable={false}
          className="object-contain w-max h-max"
          src={imgSrc}
          alt=""
        />
      </div>
      <div className="mt-4 text-2xl text-center text-gray-400 group-hover:text-white">
        {name}
      </div>
    </div>
  );
};

const App = () => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

  const selectProfile = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col">
        <h1 className="text-3xl text-center text-white md:text-6xl">
          Who&#39;s watching?
        </h1>
        <div className="flex items-center justify-center gap-8 mt-10">
          <div onClick={() => selectProfile()}>
            <UserCard name={currentUser?.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
