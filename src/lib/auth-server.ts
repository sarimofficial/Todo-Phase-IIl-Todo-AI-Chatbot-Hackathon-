import { betterAuth } from "better-auth";
import { PostgresDialect } from "kysely";
import pg from "pg";

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
pool.on('error', (err) => {
    console.error('[auth-server] Unexpected error on idle client', err);
});

// Create PostgreSQL dialect for Better Auth
const postgresDialect = new PostgresDialect({ pool });

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is not configured. Please set it in your environment variables.");
}

export const auth = betterAuth({
    database: postgresDialect,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to false for development
    },
});
