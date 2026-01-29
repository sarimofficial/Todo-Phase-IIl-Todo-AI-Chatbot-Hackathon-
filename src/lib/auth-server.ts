import { betterAuth } from "better-auth";
import { PostgresDialect } from "kysely";
import pg from "pg";

// Lazy initialization - only create auth instance when first used, not at module load time
let authInstance: ReturnType<typeof betterAuth> | null = null;
let initError: Error | null = null;

function initializeAuth() {
    if (authInstance) {
        return authInstance;
    }

    if (initError) {
        throw initError;
    }

    try {
        // Environment variables are automatically loaded by Next.js from .env.local (dev) and Vercel (prod)
        console.log('[auth-server] DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set');
        console.log('[auth-server] BETTER_AUTH_SECRET:', process.env.BETTER_AUTH_SECRET ? 'Set (hidden)' : 'Not set');

        // Get database URL from environment
        const databaseUrl = process.env.DATABASE_URL;

        if (!databaseUrl) {
            throw new Error("DATABASE_URL is not configured. Please set it in your environment variables.");
        }

        // Create PostgreSQL connection pool
        const pool = new pg.Pool({ 
            connectionString: databaseUrl,
            max: 20, // Maximum number of connections in the pool
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        // Log pool errors
        pool.on('error', (err: Error) => {
            console.error('[auth-server] Unexpected error on idle client', err);
        });

        // Create PostgreSQL dialect for Better Auth
        const postgresDialect = new PostgresDialect({ pool });

        const secret = process.env.BETTER_AUTH_SECRET;
        if (!secret) {
            throw new Error("BETTER_AUTH_SECRET is not configured. Please set it in your environment variables.");
        }

        authInstance = betterAuth({
            database: postgresDialect,
            emailAndPassword: {
                enabled: true,
                requireEmailVerification: false, // Set to false for development
            },
            secret: secret,
            trustedOrigins: [
                "https://todo-phase-i-il-todo-ai-chatbot-hac.vercel.app",
                process.env.NEXT_PUBLIC_APP_URL || "https://todo-phase-i-il-todo-ai-chatbot-hac.vercel.app",
            ].filter(Boolean),
        });

        return authInstance;
    } catch (error) {
        initError = error instanceof Error ? error : new Error(String(error));
        throw initError;
    }
}

export const auth = new Proxy(
    {},
    {
        get: (target, prop) => {
            const instance = initializeAuth();
            return (instance as any)[prop];
        },
    }
) as ReturnType<typeof betterAuth>;
