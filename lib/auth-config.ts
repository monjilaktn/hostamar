import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const GOOGLE_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const FB_ID = process.env.FACEBOOK_CLIENT_ID || ''
const FB_SECRET = process.env.FACEBOOK_CLIENT_SECRET || ''

export const authOptions = {
  providers: [
    ...(GOOGLE_ID && GOOGLE_SECRET ? [
      GoogleProvider({
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
      }),
    ] : []),
    ...(FB_ID && FB_SECRET ? [
      FacebookProvider({
        clientId: FB_ID,
        clientSecret: FB_SECRET,
      }),
    ] : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const customer = await prisma.customer.findUnique({
          where: { email: credentials.email },
        })

        if (!customer) return null

        const valid = await bcrypt.compare(credentials.password, customer.password)
        if (!valid) return null

        return {
          id: customer.id,
          email: customer.email,
          name: customer.name,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      // Handle OAuth accounts — create user if doesn't exist
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        const email = token.email
        if (email) {
          const existing = await prisma.customer.findUnique({ where: { email } })
          if (!existing) {
            await prisma.customer.create({
              data: {
                email,
                name: token.name || email.split('@')[0],
                password: '', // OAuth users have no password
                credits: 3,
              },
            })
          }
        }
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
