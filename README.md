## Section 1: Folder Structure

### 1. Define a folder structure

- create a folder using Nextjs without src and app folder

```bash
npx create-next-app --typescript
```

### 2. install tailwind css

- install [Tailwind CSS](https://tailwindcss.com/docs/guides/nextjs)

```js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- Configure your template paths

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- Add the Tailwind directives to your CSS

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Section 2: Auth Screen UI

### 3. Global style

- add global style in [globals.css](/styles/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-zinc-900 h-full overflow-x-hidden;
}

#__next {
  @apply h-full;
}

html {
  @apply h-full;
}
```

### 4. Authentication

- create [Input](/components/Input.tsx)

```tsx
interface InputProps {
  id: string;
  onChange: any;
  value: string;
  label: string;
  type?: string;
}

const Input = ({ id, onChange, value, label, type }: InputProps) => {
  return (
    <div className="relative">
      <input
        onChange={onChange}
        value={value}
        type={type}
        id={id}
        className="
        block
        rounded-md
        px-6
        pt-6
        pb-1
        w-full
        text-md
      text-white
      bg-neutral-700
        appearance-none
        focus:outline-none
        focus:ring-0
        peer
        invalid:border-b-1
        "
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="
        absolute 
        text-md
      text-zinc-400
        duration-150 
        transform 
        -translate-y-3 
        scale-75 
        top-4 
        z-10 
        origin-[0] 
        left-6
        peer-placeholder-shown:scale-100 
        peer-placeholder-shown:translate-y-0 
        peer-focus:scale-75
        peer-focus:-translate-y-3
      "
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
```

- create [Auth](/pages/auth.tsx)

```tsx
import Input from "@/components/Input";
import { useCallback, useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  //variant is used to toggle between login and register
  const [variant, setVariant] = useState("login");

  //toggle between login and register
  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);
  return (
    <div className=" relative w-full h-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" alt="" className="h-12" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-4xl mb-8 text-white font-semibold">
              {variant === "login" ? "Sign in" : "Register"}
            </h2>
            <div className="flex flex-col gap-4">
              {variant === "register" && (
                <Input
                  id="name"
                  type="text"
                  label="Username"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                />
              )}
              <Input
                id="email"
                type="email"
                label="Email address or phone number"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                id="password"
                label="Password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />
              <button className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
                {variant === "login" ? "Login" : "Sign up"}
              </button>
              <p className="text-neutral-500 mt-12">
                {variant === "login"
                  ? "First time using Netflix?"
                  : "Already have an account?"}
                <span
                  className="text-white ml-1 hover:underline cursor-pointer"
                  onClick={toggleVariant}
                >
                  {variant === "login" ? "Create an account" : "Login"}
                </span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
```

## Section 3: NextAuth Prisma MongoDB

### 5. Install Prisma

- install [Prisma](https://www.prisma.io/docs/getting-started/quickstart)

```bash
$ npm i -D prisma
$ npx prisma init
$ npm install next-auth @prisma/client @next-auth/prisma-adapter
```

- create [prismadb.ts](/lib/prismadb.ts)

```ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
```

- create [global.d.ts](/global.d.ts)

#### NB: We can directly include that in [prismadb.ts](/lib/prismadb.ts)

```ts
import { PrismaClient } from "@prisma/client";
declare global {
  namespace globalThis {
    var prisma: prismaClient | undefined;
  }
}
```

- Prisma connect to mongoDB database
  - fill [env](/.env)

### 6. Create Prisma Schema

- create [User-Post-Comment-Notification model](/prisma/schema.prisma)

```js
model User {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  name String
  image String?
  email String? @unique
  emailVerified DateTime?
  hashedPassword String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  sessions Session[]
  accounts Account[]
  favoriteIds String[] @db.ObjectId
}

model Account {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  userId             String   @db.ObjectId
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.String
  access_token       String?  @db.String
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.String
  session_state      String?
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  sessionToken String @unique
  userId String @db.ObjectId
  expires DateTime
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model Movie {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  title String
  description String
  videoUrl String
  thumbnailUrl String
  genre String
  duration String
}
```

- run:

```bash
$ npm prisma db push
```

### 7. [...nextauth] API

- install

```bash
$ npm install bcrypt
$ npm install -D @types/bcrypt
$ npm i axios
```

- create [...nextauth](/pages/api/auth/[...nextauth].ts)

```js
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/lib/prismadb";

export default NextAuth({
  adapter: PrismaAdapter(prisma), // PrismaAdapter is a NextAuth adapter for Prisma
  providers: [
    // CredentialsProvider is a NextAuth provider that allows users to sign in with an email and password.
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      // The authorize function is called when a user signs in with the credentials provider.
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }
        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        // If the user doesn't exist or the user doesn't have a hashed password, throw an error.
        if (!user || !user?.hashedPassword) {
          throw new Error("Email doesn't exist or invalid");
        }
        // bcrypt.compare() is a function that compares the password entered by the user with the hashed password stored in the database.
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        // If the password is incorrect, throw an error.
        if (!isCorrectPassword) {
          throw new Error("Incorrect password or invalid");
        }
        // If the password is correct, return the user object.
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
});
```

### 8. [Register API](/pages/api/register.ts)

- create [register](/pages/api/register.ts) && [auth](/pages/auth.tsx)

```ts
import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

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
```

- update [auth](/pages/auth.tsx)

```tsx
//resgister user
const register = useCallback(async () => {
  try {
    await axios.post("/api/auth/register", { email, name, password });
  } catch (error) {
    console.log("🚀 ~ file: auth.tsx:22 ~ register ~ error:", error);
  }
}, [email, name, password]);
//---------- submit button
<button
  onClick={register}
  className="w-full py-3 mt-10 text-white transition bg-red-600 rounded-md hover:bg-red-700"
>
  {variant === "login" ? "Login" : "Sign up"}
</button>;
```

- test [register()](/pages/auth.tsx) & [Register API](/pages/api/register.ts)

### 9. [Login()](/pages/auth.tsx)

- import {SignIn} from "next-auth/react"
- create [Login()](/pages/auth.tsx)

```js
//login user
const login = useCallback(async () => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    router.push("/");
  } catch (error) {
    console.log(error);
  }
}, [email, password, router]);

//---- conditional rendering
<button
  onClick={variant === "login" ? login : register}
  className="w-full py-3 mt-10 text-white transition bg-red-600 rounded-md hover:bg-red-700"
>
  {variant === "login" ? "Login" : "Sign up"}
</button>;
```

## Section 4: Google and Github Auth

### 10. Add Google and Github Authentication

- install

```bash
$ npm i react-icons
```

- add [Google and Github Provider](/pages/auth.tsx)

```tsx
<div className="flex flex-row items-center justify-center gap-4 mt-8">
  <div
    onClick={() => signIn("google", { callbackUrl: "/profiles" })}
    className="flex items-center justify-center w-10 h-10 transition bg-white rounded-full cursor-pointer hover:opacity-80"
  >
    <FcGoogle size={32} />
  </div>
  <div
    onClick={() => signIn("github", { callbackUrl: "/profiles" })}
    className="flex items-center justify-center w-10 h-10 transition bg-white rounded-full cursor-pointer hover:opacity-80"
  >
    <FaGithub size={32} />
  </div>
</div>
```

- add [Github and Google env variables](/.env)
- add [Google and Github Providers](/pages/api/auth/[...nextauth].ts)

```ts
GithubProvider({
        clientId: process.env.GITHUB_ID || '',
        clientSecret: process.env.GITHUB_SECRET || '',
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      }),
```

![Github](./public/images/github.png)

- generate `Github secret and client` in [Github secret and id](/https://github.com) && [auth](/pages/auth.tsx)

![Google](./public/images/google.png)

- generate `Google secret and client` in [Google console](https://console.cloud.google.com)

## Section 5:Protecting routes, Profiles screen

### 11. ServerAuth

- create [ServerAuth](/lib/serverAuth.ts)

```ts
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prismadb from "@/lib/prismadb";

//NB: we are going to use that to check if user is signed in and get user object from prisma db
//receive api request and return user object
const serverAuth = async (req: NextApiRequest) => {
  //get session from next-auth client, receive user object
  const session = await getSession({ req }); //we use session to get other fields from user object (fields are defined in prisma schema)

  //check if session exists
  if (!session?.user?.email) {
    throw new Error("Not signed in");
  }

  //get user from prisma db
  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  //check if user exists
  if (!currentUser) {
    throw new Error("Not signed in");
  }

  //return user object
  return { currentUser };
};

export default serverAuth;
```

### 12.currentUser Route

- create [current](/pages/api/current.ts)

```ts
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
```

### 13. create fetcher lib for react SWR

- create [fetcher](/lib/fetcher.ts)

```ts
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default fetcher;
```

### 14. create useCurrentUser hooks

<!--  useCurrentUser hooks  is used to load the current user-->

- install SWR

```bash
npm install swr
```

- create [useCurrentUser](/hooks/useCurrentUser.ts)

```ts
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/current", fetcher); //it will fetch data from /api/current and return user object
  //SWR don't refetch the data if it's already in cache

  return {
    data,
    isLoading,
    mutate,
    error,
  };
};

export default useCurrentUser;
```

### 15. Protect our Home Route

<!-- user cannot visit homePage if he is not logged -->

- [index](/pages/index.tsx)

```tsx
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
  return (
    <>
      <h1 className="text-amber-400 text-bold ">Netflix clone</h1>
      <button className="w-full h-10 bg-white" onClick={() => signOut()}>
        Logout!
      </button>
    </>
  );
}
```

### 16. fetch user using useCurrentUser hook

```ts
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
```

### 17. Profile Screen

- create [profiles](/pages/profiles.tsx)

```ts
import useCurrentUser from "@/hooks/useCurrentUser";
import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
    props: {},
  };
}

const profiles = () => {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  console.log(
    "🚀 ~ file: profiles.tsx:26 ~ profiles ~ data:",
    user?.currentUser.name
  );
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col">
        <h1 className="text-3xl text-center text-white md:text-6xl">
          who is watching
        </h1>
        <div className="flex items-center justify-center gap-8 mt-10">
          <div className="cursor-pointer" onClick={() => router.push("/")}>
            <div className="flex-row mx-auto group w-44">
              <div className="relative flex items-center justify-center overflow-hidden border-2 border-transparent rounded h-44 w-44 group-hover:cursor-pointer group-hover:border-white">
                <img src="/images/default-blue.png" alt="profile" />
              </div>
              <div className="mt-4 text-2xl text-center text-gray-400 group-hover:text-white">
                {user?.currentUser.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default profiles;
```

- redirect to [profiles](/pages/profiles.tsx) instead of [Homes](/pages/index.tsx) in [auth](/pages/auth.tsx)

## Section 6:Navbar

### 17. NavbarItem

- create [Navbar](/components/Navbar.tsx)
- [NavbarItem](/components/NavbarItem.tsx)

```tsx
import React from "react";

interface NavbarItemProps {
  label: string;
  active?: boolean;
}

const NavbarItem = ({ label, active }: NavbarItemProps) => {
  return (
    <div
      className={
        active
          ? "text-white cursor-default"
          : "text-gray-200 hover:text-gray-300 cursor-pointer transition"
      }
    >
      {label}
    </div>
  );
};

export default NavbarItem;
```

- create [Navbar](/components/Navbar.tsx)

```tsx
import NavbarItem from "./NavbarItem";

const Navbar = () => {
  return (
    <div>
      <NavbarItem label="Home" />
    </div>
  );
};

export default Navbar;
```

### 18. Navbar [NavbarItem]

- install [heroicons](/https://www.npmjs.com/package/@heroicons/react)

```tsx
$ npm i @heroicons/react
```

- update create [Navbar](/components/Navbar.tsx)

```tsx
import NavbarItem from "@/components/NavbarItem";

const Navbar = () => {
  return (
    <nav className="fixed z-40 w-full">
      <div
        className="px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 $
        bg-zinc-900 bg-opacity-90
        "
      >
        <img src="/images/logo.png" className="h-4 lg:h-7" alt="Logo" />
        <div className="flex-row hidden ml-8 gap-7 lg:flex">
          <NavbarItem label="Home" active />
          <NavbarItem label="Series" />
          <NavbarItem label="Films" />
          <NavbarItem label="New & Popular" />
          <NavbarItem label="My List" />
          <NavbarItem label="Browse by Languages" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

### 19. Navbar [MobileMenu]

- create [MobileMenu](/components/MobileMenu.tsx)

```tsx
import React from "react";

interface MobileMenuProps {
  visible?: boolean;
}

const MobileMenu = ({ visible }: MobileMenuProps) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="absolute left-0 flex flex-col w-56 py-5 bg-black border-2 border-gray-800 top-8">
      <div className="flex flex-col gap-4">
        <div className="px-3 text-center text-white hover:underline">Home</div>
        <div className="px-3 text-center text-white hover:underline">
          Series
        </div>
        <div className="px-3 text-center text-white hover:underline">Films</div>
        <div className="px-3 text-center text-white hover:underline">
          New & Popular
        </div>
        <div className="px-3 text-center text-white hover:underline">
          My List
        </div>
        <div className="px-3 text-center text-white hover:underline">
          Browse by Languages
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
```

- update create [Navbar](/components/Navbar.tsx)

```tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

import NavbarItem from "@/components/NavbarItem";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((current) => !current);
  }, []);

  return (
    <nav className="fixed z-40 w-full">
      <div className="flex flex-row items-center px-4 py-6 transition duration-500 md:px-16 ">
        <img src="/images/logo.png" className="h-4 lg:h-7" alt="Logo" />
        <div className="flex-row hidden ml-8 gap-7 lg:flex">
          <NavbarItem label="Home" active />
          <NavbarItem label="Series" />
          <NavbarItem label="Films" />
          <NavbarItem label="New & Popular" />
          <NavbarItem label="My List" />
          <NavbarItem label="Browse by Languages" />
        </div>
        <div
          onClick={toggleMobileMenu}
          className="relative flex flex-row items-center gap-2 ml-8 cursor-pointer lg:hidden"
        >
          <p className="text-sm text-white">Browse</p>
          <ChevronDownIcon
            className={`w-4 text-white fill-white transition ${
              showMobileMenu ? "rotate-180" : "rotate-0"
            }`}
          />
          <MobileMenu visible={showMobileMenu} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

### 20. Navbar [AccountMenu]

- create [AccountMenu](/components/AccountMenu.tsx)

```tsx
import { signOut } from "next-auth/react";
import React from "react";

import useCurrentUser from "@/hooks/useCurrentUser";

interface AccountMenuProps {
  visible?: boolean;
}

const AccountMenu = ({ visible }: AccountMenuProps) => {
  const { data: currentUser } = useCurrentUser();

  if (!visible) {
    return null;
  }

  return (
    <div className="bg-black w-56 absolute top-14 right-0 py-5 flex-col border-2 border-gray-800 flex">
      <div className="flex flex-col gap-3">
        <div className="px-3 group/item flex flex-row gap-3 items-center w-full">
          <img
            className="w-8 rounded-md"
            src="/images/default-blue.png"
            alt=""
          />
          <p className="text-white text-sm group-hover/item:underline">
            {currentUser?.currentUser.name}
          </p>
        </div>
      </div>
      <hr className="bg-gray-600 border-0 h-px my-4" />
      <div
        onClick={() => signOut()}
        className="px-3 text-center text-white text-sm hover:underline"
      >
        Sign out of Netflix
      </div>
    </div>
  );
};

export default AccountMenu;
```

- update create [Navbar](/components/Navbar.tsx)

```tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

import AccountMenu from "@/components/AccountMenu";
import MobileMenu from "@/components/MobileMenu";
import NavbarItem from "@/components/NavbarItem";

const TOP_OFFSET = 66; // is the value where we trigger the background color change

const Navbar = () => {
  const [showAccountMenu, setShowAccountMenu] = useState(false); // to toggle the account menu
  const [showMobileMenu, setShowMobileMenu] = useState(false); // to toggle the mobile menu
  const [showBackground, setShowBackground] = useState(false); // to show the background color when the user scrolls down

  // to show the background color when the user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY);
      if (window.scrollY >= TOP_OFFSET) {
        setShowBackground(true);
      } else {
        setShowBackground(false);
      }
    };
    //listen to the scroll event
    window.addEventListener("scroll", handleScroll);
    //remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // to toggle the account menu
  const toggleAccountMenu = useCallback(() => {
    setShowAccountMenu((current) => !current);
  }, []);

  // to toggle the mobile menu
  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((current) => !current);
  }, []);

  return (
    <nav className="fixed z-40 w-full">
      <div
        className={`px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 ${
          showBackground ? "bg-zinc-900 bg-opacity-90" : ""
        }`}
      >
        <img src="/images/logo.png" className="h-4 lg:h-7" alt="Logo" />
        <div className="flex-row hidden ml-8 gap-7 lg:flex">
          <NavbarItem label="Home" active />
          <NavbarItem label="Series" />
          <NavbarItem label="Films" />
          <NavbarItem label="New & Popular" />
          <NavbarItem label="My List" />
          <NavbarItem label="Browse by Languages" />
        </div>
        <div
          onClick={toggleMobileMenu}
          className="relative flex flex-row items-center gap-2 ml-8 cursor-pointer lg:hidden"
        >
          <p className="text-sm text-white">Browse</p>
          <ChevronDownIcon
            className={`w-4 text-white fill-white transition ${
              showMobileMenu ? "rotate-180" : "rotate-0"
            }`}
          />
          <MobileMenu visible={showMobileMenu} />
        </div>
        <div className="flex flex-row items-center ml-auto gap-7">
          <div className="text-gray-200 transition cursor-pointer hover:text-gray-300">
            <MagnifyingGlassIcon className="w-6" />
          </div>
          <div className="text-gray-200 transition cursor-pointer hover:text-gray-300">
            <BellIcon className="w-6" />
          </div>
          <div
            onClick={toggleAccountMenu}
            className="relative flex flex-row items-center gap-2 cursor-pointer"
          >
            <div className="w-6 h-6 overflow-hidden rounded-md lg:w-10 lg:h-10">
              <img src="/images/default-blue.png" alt="" />
            </div>
            <ChevronDownIcon
              className={`w-4 text-white fill-white transition ${
                showAccountMenu ? "rotate-180" : "rotate-0"
              }`}
            />
            <AccountMenu visible={showAccountMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

## Section 7: BillBoard & Random Movie

### 21. random Api

- add [movies](/movies.json) data to the Mongodb data base
- create [random Api](/pages/api/random.ts)

```ts
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
```

### 22. Billboard hooks

- create [useBillboard](/hooks/useBillboard.ts)

```tsx
import useSwr from "swr";
import fetcher from "@/lib/fetcher";

const useBillboard = () => {
  const { data, error, isLoading } = useSwr("/api/random", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    data,
    error,
    isLoading,
  };
};

export default useBillboard;
```

### 23. Billboard

- create [Billboard](/components/Billboard.tsx)

```tsx
import React, { useCallback } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

import useBillboard from "@/hooks/useBillboard";

const Billboard: React.FC = () => {
  const { data } = useBillboard();

  return (
    <div className="relative h-[56.25vw]">
      <video
        poster={data?.thumbnailUrl}
        className="w-full h-[56.25vw] object-cover brightness-[60%] transition duration-500"
        autoPlay
        muted
        loop
        src={data?.videoUrl}
      ></video>
      <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16">
        <p className="text-white text-1xl md:text-5xl h-full w-[50%] lg:text-6xl font-bold drop-shadow-xl">
          {data?.title}
        </p>
        <p className="text-white text-[8px] md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%] drop-shadow-xl">
          {data?.description}
        </p>
        <div className="flex flex-row items-center gap-3 mt-3 md:mt-4">
          <button className="flex flex-row items-center w-auto px-2 py-1 text-xs font-semibold text-white transition bg-white rounded-md bg-opacity-30 md:py-2 md:px-4 lg:text-lg hover:bg-opacity-20">
            <InformationCircleIcon className="w-4 mr-1 md:w-7" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};
export default Billboard;
```

### 24. Movie List

- create [movies Api](/pages/api/movies/index.ts)

```ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb"; //prismadb or prisma
import serverAuth from "@/lib/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).end();
    }

    await serverAuth(req);

    //load all movies
    const movies = await prisma.movie.findMany();
    //return all movies
    return res.status(200).json(movies);
  } catch (error) {
    console.log({ error });
    return res.status(500).end();
  }
}
```

- create [useMovieList](/hooks/useMovieList.ts)

```tsx
import useSwr from "swr";
import fetcher from "@/lib/fetcher";

const useMovies = () => {
  const { data, error, isLoading } = useSwr("/api/movies", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    data,
    error,
    isLoading,
  };
};

export default useMovies;
```

- create [MovieCard](/components/MovieCard.tsx)

```tsx
import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";

import { MovieInterface } from "@/types";
// import FavoriteButton from "@/components/FavoriteButton";
// import useInfoModalStore from "@/hooks/useInfoModalStore";

interface MovieCardProps {
  data: MovieInterface;
}

const MovieCard = ({ data }: MovieCardProps) => {
  const router = useRouter();
  //   const { openModal } = useInfoModalStore();

  const redirectToWatch = useCallback(
    () => router.push(`/watch/${data.id}`),
    [router, data.id]
  );

  return (
    <div className="group bg-zinc-900 col-span relative h-[12vw]">
      <img
        // onClick={redirectToWatch}
        src={data.thumbnailUrl}
        alt="Movie"
        draggable={false}
        className="
        cursor-pointer
        object-cover
        transition
        duration
        shadow-xl
        rounded-md
        group-hover:opacity-90
        sm:group-hover:opacity-0
        delay-300
        w-full
        h-[12vw]
      "
      />
      <div
        className="
        opacity-0
        absolute
        top-0
        transition
        duration-200
        z-10
        invisible
        sm:visible
        delay-300
        w-full
        scale-0
        group-hover:scale-110
        group-hover:-translate-y-[6vw]
        group-hover:translate-x-[2vw]
        group-hover:opacity-100
      "
      >
        <img
          //   onClick={redirectToWatch}
          src={data.thumbnailUrl}
          alt="Movie"
          draggable={false}
          className="
          cursor-pointer
          object-cover
          transition
          duration
          shadow-xl
          rounded-t-md
          w-full
          h-[12vw]
        "
        />
        <div className="absolute z-10 w-full p-2 transition shadow-md bg-zinc-800 lg:p-4 rounded-b-md">
          <div className="flex flex-row items-center gap-3">
            <div
              onClick={redirectToWatch}
              className="flex items-center justify-center w-6 h-6 transition bg-white rounded-full cursor-pointer lg:w-10 lg:h-10 hover:bg-neutral-300"
            >
              <PlayIcon className="w-4 text-black lg:w-6" />
            </div>
            {/* <FavoriteButton movieId={data.id} /> */}
            <div
              //   onClick={() => openModal(data?.id)}
              className="flex items-center justify-center w-6 h-6 ml-auto transition border-2 border-white rounded-full cursor-pointer group/item lg:w-10 lg:h-10 hover:border-neutral-300"
            >
              <ChevronDownIcon className="w-4 text-white group-hover/item:text-neutral-300 lg:w-6" />
            </div>
          </div>
          <p className="mt-4 font-semibold text-green-400">
            New <span className="text-white">2023</span>
          </p>
          <div className="flex flex-row items-center gap-2 mt-4">
            <p className="text-white text-[10px] lg:text-sm">{data.duration}</p>
          </div>
          <div className="flex flex-row items-center gap-2 mt-4 text-[8px] text-white lg:text-sm">
            <p>{data.genre}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
```

- create [](/components/MovieList.tsx)

```tsx
import React from "react";

import { MovieInterface } from "@/types";
import MovieCard from "@/components/MovieCard";
import { isEmpty } from "lodash";

interface MovieListProps {
  data: MovieInterface[];
  title: string;
}

const MovieList = ({ data, title }: MovieListProps) => {
  if (isEmpty(data)) {
    return null;
  }

  return (
    <div className="px-4 md:px-12 mt-4 space-y-8">
      <div>
        <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">
          {title}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {data.map((movie) => (
            <MovieCard key={movie.id} data={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
```

- create [types](/types/index.ts)

```ts
export interface MovieInterface {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  genre: string;
}
```

### 25.

### 26.

## Section 8:

### 27.

### 28.

### 29.

### 30.

## Section 9:

## External Links

- [React icons](https://react-icons.github.io/react-icons/)
- [group/item - tailwind css](/)
