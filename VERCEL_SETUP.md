# Vercel Deployment Setup

## Required Environment Variables

To fix the 500 Internal Server Error on Vercel, you need to configure the following environment variables in your Vercel project settings:

### 1. Go to Vercel Dashboard
- Navigate to your project: https://vercel.com/dashboard
- Select your project: `Todo-Phase-IIl-Todo-AI-Chatbot-Hackathon-`
- Go to **Settings** → **Environment Variables**

### 2. Add These Environment Variables

#### Database Configuration
```
DATABASE_URL=postgresql://neondb_owner:npg_ItBy9nA4CFxY@ep-blue-sunset-a41xhxzr-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### Better Auth Secret (32+ characters)
```
BETTER_AUTH_SECRET=this-is-a-secure-32-char-secret-key-123
```

#### Backend API URL
```
NEXT_PUBLIC_API_URL=https://sarimdev-todo-phase-iil-todo-ai-chatbot-hackathon.hf.space
BACKEND_URL=https://sarimdev-todo-phase-iil-todo-ai-chatbot-hackathon.hf.space
```

#### Auth URL (Optional - leave unset to use relative paths)
```
# DO NOT SET THIS - let it default to /api/auth
# NEXT_PUBLIC_BETTER_AUTH_URL=/api/auth
```

### 3. Redeploy

After adding the environment variables:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** button
4. Wait for the deployment to complete

### 4. Verify

Once redeployed, test the following:
- Login at: https://todo-phase-i-il-todo-ai-chatbot-hac.vercel.app/login
- Dashboard access after login
- Task creation and management

## Troubleshooting

### 500 Internal Server Error
- Check that `DATABASE_URL` is set correctly
- Verify `BETTER_AUTH_SECRET` is at least 32 characters
- Check Vercel function logs for detailed error messages

### 403 Forbidden
- Ensure `trustedOrigins` in `src/lib/auth-server.ts` includes your Vercel domain
- Check CORS headers in `src/app/api/auth/[...all]/route.ts`

### Session Not Persisting
- Verify cookies are being set (check browser DevTools → Application → Cookies)
- Ensure `credentials: 'include'` is set in auth-client
- Check that auth requests are going to the same domain (not cross-origin)

## Current Configuration

The app is configured to:
- Use relative path `/api/auth` for auth requests (same-origin)
- Include credentials (cookies) in all auth requests
- Trust requests from `localhost:3000` and your Vercel domain
- Use PostgreSQL database on Neon for user storage
