import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
          throw new Error("Email and password are required");
        }

        try {
          const db = await connectDB();
          
          // Find user by email
          const user = await db.collection('users').findOne({ 
            email: credentials.email.toLowerCase() 
          });
          
          if (!user) {
            throw new Error("Invalid email or password");
          }
          
          // Compare password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error("Invalid email or password");
          }
          
          // Return user without password
          const { password, ...userWithoutPassword } = user;
          
          return {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role || 'user',
            profile: user.profile || {}
          };
        } catch (error) {
          console.error('Error in authorize:', error);
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.profile = user.profile;
      }
      
      // If the token has expired, try to refresh user data from DB
      if (Date.now() > token.exp * 1000 - 300000) { // 5 minutes before expiration
        try {
          const db = await connectDB();
          const updatedUser = await db.collection('users').findOne(
            { _id: new ObjectId(token.id) },
            { projection: { password: 0 } }
          );
          
          if (updatedUser) {
            token.firstName = updatedUser.firstName;
            token.lastName = updatedUser.lastName;
            token.role = updatedUser.role;
            token.profile = updatedUser.profile;
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.user = {
        id: token.id,
        email: token.email,
        firstName: token.firstName,
        lastName: token.lastName,
        role: token.role,
        profile: token.profile
      };
      
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };