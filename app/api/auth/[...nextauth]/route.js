// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import connectDb from "@/utils/connectDb";
import valid from "@/utils/valid";
import bcrypt from "bcryptjs";


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },

      },
      async authorize(credentials) {
        await connectDb();

        const { email, password } = credentials;
        const validationMsg = valid("", email, password);
        // if (validationMsg) throw new Error(validationMsg);

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }
        console.log(validationMsg);
        

        return { id: user._id, email: user.email }; // must return an object for session
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectDb();
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.name = dbUser.name;
        session.user.email = dbUser.email;
        session.user.avatar = dbUser.avatar;
        session.user.role = dbUser.role;
        // ⚠️ storing plain password is insecure
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
