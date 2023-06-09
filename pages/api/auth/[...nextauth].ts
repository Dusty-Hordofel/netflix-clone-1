import { compare } from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/libs/prismadb";

export default NextAuth({
  adapter: PrismaAdapter(prisma), // PrismaAdapter is a NextAuth adapter for Prisma
  providers: [
    // CredentialsProvider is a NextAuth provider that allows users to sign in with an email and password.
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
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
        const isCorrectPassword = await compare(
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
