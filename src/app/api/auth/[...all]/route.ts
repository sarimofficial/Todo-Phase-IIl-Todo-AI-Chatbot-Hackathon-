/**
 * Better Auth API Route Handler
 * Handles all /api/auth/* requests
 */


import { auth } from '@/lib/auth-server'
import { toNextJsHandler } from 'better-auth/next-js'

const handler = toNextJsHandler(auth);

const defaultAllowedOrigin = process.env.NEXT_PUBLIC_BETTER_AUTH_ALLOW_ORIGIN || '*';

function buildCorsHeaders(req: Request) {
    const origin = req.headers.get('origin') || defaultAllowedOrigin;
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Credentials': 'true'
    };
}

async function attachCors(res: Response, req: Request) {
    const cors = buildCorsHeaders(req);
    const body = await res.text();
    const headers = new Headers(res.headers);
    Object.entries(cors).forEach(([k, v]) => headers.set(k, v as string));
    return new Response(body, { status: res.status, headers });
}

export const OPTIONS = async (req: Request) => {
    const headers = buildCorsHeaders(req);
    return new Response(null, { status: 204, headers });
};

export const GET = async (req: Request) => {
    try {
        const res = await handler.GET(req);
        return await attachCors(res, req);
    } catch (error) {
        console.error("Better Auth GET Error:", error);
        throw error;
    }
};

export const POST = async (req: Request) => {
    try {
        const res = await handler.POST(req);
        return await attachCors(res, req);
    } catch (error) {
        console.error("Better Auth POST Error:", error);
        throw error;
    }
};

