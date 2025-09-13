import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import User from "@/models/User";
import connect from "@/lib/databaseconnect";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();
        console.log("Credentials received:", credentials);

        const user = await User.findOne({ username: credentials.username });
        console.log("User found:", user);

        if (!user) {
          console.log("No user found for username:", credentials.username);
          return null;
        }

        const isValid = await compare(
          String(credentials.password),
          String(user.password),
        );
        console.log("Password valid:", isValid);

        if (!isValid) {
          console.log("Password did not match for user:", credentials.username);
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const user = session.user as {
        id?: string;
        name?: string;
        username?: string;
        role?: string;
      };
      if (typeof token.id === "string") user.id = token.id;
      if (typeof token.name === "string") user.name = token.name;
      if (typeof token.username === "string") user.username = token.username;
      if (typeof token.role === "string") user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        if ("id" in user && typeof user.id === "string") token.id = user.id;
        if ("name" in user && typeof user.name === "string")
          token.name = user.name;
        if ("username" in user && typeof user.username === "string")
          token.username = user.username;
        if ("role" in user && typeof user.role === "string")
          token.role = user.role;
      }
      return token;
    },
  },
});
