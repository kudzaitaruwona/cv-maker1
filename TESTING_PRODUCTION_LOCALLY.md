# Testing Production Build Locally

This guide explains how to test your production build on your laptop before deploying to Vercel.

## Method 1: Standard Next.js Production Build (Recommended)

### Step 1: Build the Production Version

```bash
npm run build
```

This will:
- Compile your Next.js app for production
- Optimize assets
- Generate static pages where possible
- Check for build errors

**Note:** If you see errors about `cacheComponents: true` causing memory issues, you may need to temporarily remove it from `next.config.ts` (this is a known Next.js 16 issue on some systems).

### Step 2: Start the Production Server

```bash
npm run start
```

This starts the production server on `http://localhost:3000`.

### Step 3: Test Your Application

1. Open `http://localhost:3000` in your browser
2. Test all major features:
   - Authentication (sign up, login, logout)
   - Dashboard
   - CV creation and editing
   - Settings page
   - All protected routes

### Step 4: Check for Production-Specific Issues

- **Environment Variables**: Make sure your `.env.local` file has all required variables
- **API Routes**: Test all server actions and API endpoints
- **Static Generation**: Check if pages that should be static are working
- **Error Boundaries**: Test error handling
- **Performance**: Check loading times and bundle sizes

## Method 2: Using Vercel CLI (Most Accurate)

For the most accurate production testing, use Vercel CLI to simulate the actual Vercel environment.

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Your Project (Optional)

```bash
vercel link
```

This connects your local project to your Vercel project.

### Step 4: Run Production Build Locally

```bash
vercel dev
```

This:
- Simulates Vercel's production environment
- Uses the same build process as Vercel
- Includes Vercel environment variables
- Runs on a different port (usually 3000)

### Step 5: Test Preview Deployment

```bash
vercel
```

This creates a preview deployment (similar to what happens on every push to a branch).

## Environment Variables for Production Testing

When testing production locally, ensure you have these in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

**Important:** These should be the same values you'll use in Vercel production.

## Differences Between Local Production and Vercel

| Aspect | Local Production | Vercel Production |
|--------|-----------------|-------------------|
| Node.js version | Your system version | Node.js 20.9+ (Next.js 16 requirement) |
| Environment variables | From `.env.local` | From Vercel dashboard |
| Build process | Same | Same (but may have memory limits) |
| Edge functions | Not available | Available |
| Serverless functions | Simulated | Real serverless |
| CDN | No | Yes (automatic) |
| HTTPS | No (localhost) | Yes |
| Custom domains | No | Yes |

## Common Issues When Testing Locally

### 1. Memory Issues with `cacheComponents`

If you get `SIGKILL OOM` errors during build:
- Temporarily remove `cacheComponents: true` from `next.config.ts`
- This is a known Next.js 16 issue

### 2. Environment Variables Not Loading

- Make sure `.env.local` is in the project root
- Restart the dev server after changing env vars
- For production build, env vars are baked in at build time

### 3. Build Errors

- Check TypeScript errors: `npm run lint`
- Check for missing dependencies
- Check for server/client component mismatches

### 4. Authentication Issues

- Make sure Supabase redirect URLs include `http://localhost:3000`
- Check that environment variables match your Supabase project

## Pre-Deployment Checklist

Before deploying to Vercel, test locally:

- [ ] Production build completes without errors (`npm run build`)
- [ ] Production server starts successfully (`npm run start`)
- [ ] All pages load correctly
- [ ] Authentication works (sign up, login, logout)
- [ ] Protected routes are properly guarded
- [ ] Server actions work correctly
- [ ] No console errors in browser
- [ ] Environment variables are set correctly
- [ ] Error boundaries catch and display errors properly
- [ ] All forms submit successfully
- [ ] Database queries work
- [ ] File uploads/downloads work (if applicable)

## Quick Test Script

You can add this to your `package.json`:

```json
{
  "scripts": {
    "test:production": "npm run build && npm run start"
  }
}
```

Then run:
```bash
npm run test:production
```

## Troubleshooting

### Build Fails

1. Check for TypeScript errors: `npx tsc --noEmit`
2. Check for linting errors: `npm run lint`
3. Check console output for specific error messages
4. Try removing `cacheComponents: true` from `next.config.ts`

### Server Won't Start

1. Check if port 3000 is already in use
2. Check for missing environment variables
3. Check for runtime errors in the build output

### Features Don't Work in Production

1. Check if you're using client-only APIs in server components
2. Check if environment variables are properly prefixed with `NEXT_PUBLIC_`
3. Check browser console for errors
4. Check server logs for errors

## Next Steps

After successful local testing:

1. Push your code to GitHub
2. Deploy to Vercel (automatic if connected, or manually via dashboard)
3. Set environment variables in Vercel dashboard
4. Test the deployed version
5. Monitor for any production-specific issues
