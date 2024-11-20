import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb' 
import { MongoClient } from 'mongodb'
import jwt from 'jsonwebtoken'
import { JWT } from 'next-auth/jwt'

const NEXTAUTH_SECRET= 'cwKXUO2DrmzeqQplxFlaAwoh80KJlOEzUXAaoXVZq8A='
console.log("Inside next-auth.js");

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const client: MongoClient = await clientPromise
        const db = client.db('Styliee')
        console.log(credentials);
        console.log(credentials?.email+" "+credentials?.password);
        
        
        const user = await db.collection('users').findOne({ email: credentials?.email })

        if (user && user.password === credentials?.password) {
          return { 
            id: user._id.toString(),
             email: user.email, 
            name:user.name
           }
        } else {
          return null
        }
      }
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt'
  },
  jwt: {
    secret: NEXTAUTH_SECRET, 
    encode: async ({ secret, token }) => {
      const jwtClaims = {
        sub: token?.id,
        name: token?.name,
        email: token?.email,
        iat: Date.now() / 1000,
        exp: Math.floor(Date.now() / 1000) + 60 * 60
      }
      return jwt.sign(jwtClaims, secret, { algorithm: 'HS256' })
    },
    decode: async ({ token }) => {
      try {
        return jwt.verify(token as string, NEXTAUTH_SECRET, { algorithms: ['HS256'] }) as JWT
      } catch (error) {
        console.log("Error in jwt.decode: "+error);
        return null
      }
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email=user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string
        (session.user as { id: string; name: string }).name = token.name as string
        (session.user as { id: string; name: string; email: string }).email = token.email as string
      }
      return session
    }
  }
}

export default NextAuth(options)