import { createAuthClient } from "better-auth/react"

// For SSR, we need a full URL. For client-side, relative path works.
// During build/SSR, use the full Vercel URL. On client, browser will use relative path.
function getBaseURL() {
    // Check if we're in the browser
    const isBrowser = typeof window !== 'undefined';
    
    // If explicitly set via environment variable, use it
    const envURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
    if (envURL) {
        return envURL;
    }
    
    // On server (SSR/build), use full URL
    if (!isBrowser) {
        const appURL = process.env.NEXT_PUBLIC_APP_URL;
        if (appURL) {
            return `${appURL}/api/auth`;
        }
        // Fallback to default production URL
        return 'https://todo-phase-i-il-todo-ai-chatbot-hac.vercel.app/api/auth';
    }
    
    // On client, use relative path (avoids CORS)
    return '/api/auth';
}

const baseURL = getBaseURL();

export const authClient = createAuthClient({
    baseURL
})

export const { signIn, signUp, signOut, useSession } = authClient
