import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          throw new Error("Email and password are required");
        }

        try {
          await connectDB(); // Ensure DB connection
          
          // Find user by email
          const user = await User.findByEmail(credentials.email);
          
          if (!user) {
            console.log("User not found:", credentials.email);
            throw new Error("Invalid email or password");
          }
          
          // Compare password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log("Invalid password for user:", credentials.email);
            throw new Error("Invalid email or password");
          }
          
          // Return user without password
          const { password, ...userWithoutPassword } = user;
          
          console.log("User authenticated:", user._id);
          return userWithoutPassword;
        } catch (error) {
          console.error('Error in authorize:', error);
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id.toString();
        token.firstName = user.firstName || '';
        token.lastName = user.lastName || '';
        token.profile = user.profile || {};
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          firstName: token.firstName,
          lastName: token.lastName,
          profile: token.profile
        };
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };