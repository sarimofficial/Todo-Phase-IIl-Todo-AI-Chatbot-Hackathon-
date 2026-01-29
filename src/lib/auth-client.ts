import { createAuthClient } from "better-auth/react"


// Default to the relative API path so same-app deployments (recommended) work without CORS/cookie issues.
// If your auth API is hosted on a different domain, set NEXT_PUBLIC_BETTER_AUTH_URL to that full origin.
const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || '/api/auth';


export const authClient = createAuthClient({
    baseURL
})

export const { signIn, signUp, signOut, useSession } = authClient
