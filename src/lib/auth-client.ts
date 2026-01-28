import { createAuthClient } from "better-auth/react"

// Use the Next.js server URL for auth requests since auth is handled by Next.js API routes
<<<<<<< HEAD
const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://todo-phase-i-il-todo-ai-chatbot-hac.vercel.app";
=======
// Default to the relative API path so same-app deployments (recommended) work without CORS/cookie issues.
// If your auth API is hosted on a different domain, set NEXT_PUBLIC_BETTER_AUTH_URL to that full origin.
const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'https://todo-phase-i-il-todo-ai-chatbot-hac.vercel.app';
>>>>>>> 2a79bb4cf51631e6bab713785451e038dba843a6

export const authClient = createAuthClient({
    baseURL
})

export const { signIn, signUp, signOut, useSession } = authClient
