import { createAuthClient } from "better-auth/react"

// Use the Next.js server URL for auth requests since auth is handled by Next.js API routes
// In production, this should be the deployed Vercel URL
const baseURL = typeof window !== 'undefined' 
    ? '' // Empty string means use current origin (browser will use current URL)
    : (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000");

export const authClient = createAuthClient({
    baseURL: baseURL || undefined // undefined will make it use the current origin
})

export const { signIn, signUp, signOut, useSession } = authClient
