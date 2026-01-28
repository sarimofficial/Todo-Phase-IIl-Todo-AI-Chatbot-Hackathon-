import { createAuthClient } from "better-auth/react"

// Use the Next.js server URL for auth requests since auth is handled by Next.js API routes
// Default to the relative API path so same-app deployments (recommended) work without CORS/cookie issues.
// If your auth API is hosted on a different domain, set NEXT_PUBLIC_BETTER_AUTH_URL to that full origin.
const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || '/api/auth';

export const authClient = createAuthClient({
    baseURL,
    // Ensure fetch includes cookies so the session cookie is sent with requests
    // This field name depends on the library; if `fetchOptions` isn't supported,
    // the library may still automatically send cookies for same-origin requests.
    fetchOptions: {
        credentials: 'include'
    }
})

export const { signIn, signUp, signOut, useSession } = authClient
