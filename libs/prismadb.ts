import { PrismaClient } from "@prisma/client";

//we do this because of Next.js hot reloading.It's means every time we change something in our code, Next.js will reload the server and we don't want to create a new PrismaClient every time we reload the server.
// declare global {
//   var prisma: PrismaClient | undefined;
// }

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
