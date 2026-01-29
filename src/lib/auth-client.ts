import { createAuthClient } from "better-auth/react"


// For SSR, we need a full URL. For client-side, relative path works.
// During build/SSR, use the full Vercel URL. On client, browser will use relative path.
const getBaseURL = () => {
    // If explicitly set, use it
    if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
        return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
    }
    
    // On server (SSR/build), use full URL
    if (typeof window === 'undefined') {
        return process.env.NEXT_PUBLIC_APP_URL 
            ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth`
            : 'https://todo-phase-i-il-todo-ai-chatbot-hac.vercel.app/api/auth';
    }
    
    // On client, use relative path (avoids CORS)
    return '/api/auth';
};

const baseURL = getBaseURL();

export const authClient = createAuthClient({
    baseURL
})

export const { signIn, signUp, signOut, useSession } = authClient
