# Potential Vercel Deployment Issues

This document lists all potential issues that could break when deploying to Vercel. Review each item and address them before deployment.

## 📌 Issue Categories

- **Next.js 16 Specific**: Issues that are specific to Next.js 16 or related to its breaking changes
- **General Deployment**: Issues that would affect any Next.js version on Vercel
- **Code Bugs**: General code issues that would break regardless of deployment platform
- **Best Practices**: Recommendations for production readiness

## 🔴 Critical Issues (Will Break Deployment)

> **Note:** Issues marked with ⚠️ are Next.js 16 specific

### 1. **Environment Variable Mismatch**
**Location:** `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/proxy.ts`
- **Issue:** Code uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` but `lib/utils.ts` checks for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Impact:** Environment variable check will fail, causing Supabase client initialization to fail
- **Files:**
  - `lib/supabase/server.ts:14` - Uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `lib/supabase/client.ts:6` - Uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `lib/supabase/proxy.ts:20` - Uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `lib/utils.ts:11` - Checks for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Fix Required:** Standardize on one environment variable name across all files

### 2. **Missing Environment Variables**
**Location:** Multiple files
- **Issue:** No `.env.example` file exists to document required environment variables
- **Impact:** Deployment will fail if required env vars are not set in Vercel dashboard
- **Required Variables:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY` - see issue #1)
- **Fix Required:** Create `.env.example` file documenting all required variables

### 3. **Function Call Instead of Function Invocation**
**Location:** `lib/supabase/proxy.ts:12`
- **Issue:** `hasEnvVars` is called without parentheses `if (!hasEnvVars)` instead of `if (!hasEnvVars())`
- **Impact:** The check will always evaluate to truthy (function object exists), so env var validation is bypassed
- **Fix Required:** Change to `if (!hasEnvVars())`

### 4. **Missing Middleware File** ⚠️ **Next.js 16 Related**
**Location:** Root directory
- **Issue:** `proxy.ts` exists but Next.js expects `middleware.ts` for middleware functionality. Next.js 16 migrated from `middleware` convention to `proxy`, but the file must still be named `middleware.ts` or properly exported
- **Impact:** Middleware won't run, causing authentication/session issues
- **Fix Required:** Either rename `proxy.ts` to `middleware.ts` or ensure it's properly configured. In Next.js 16, middleware should export a default function from `middleware.ts`

### 5. **VERCEL_URL Usage Issue**
**Location:** `app/layout.tsx:10-12`
- **Issue:** `VERCEL_URL` doesn't include protocol in production. Should use `VERCEL_URL` for previews but `NEXT_PUBLIC_VERCEL_URL` or construct URL properly
- **Impact:** Metadata base URL may be incorrect, causing issues with Open Graph tags, canonical URLs, etc.
- **Fix Required:** Use proper Vercel environment variables (`VERCEL_URL` for server-side, or construct URL correctly)

## 🟡 High Priority Issues (May Cause Runtime Errors)

### 6. **Window Object Usage in Client Components** ⚠️ **Next.js 16 Related**
**Location:** `components/forgot-password-form.tsx:36`, `components/sign-up-form.tsx:48`
- **Issue:** `window.location.origin` is used without checking if `window` exists. Next.js 16 has stricter rules about React hooks in client components during static generation
- **Impact:** While these are client components, SSR hydration could cause issues. Next.js 16 may fail builds with "Cannot read properties of null" errors during static generation
- **Files:**
  - `components/forgot-password-form.tsx:36` - `window.location.origin`
  - `components/sign-up-form.tsx:48` - `window.location.origin`
- **Fix Required:** Add safety check or use Next.js `useRouter`/`headers()` for server-side URL detection. Consider adding `export const dynamic = 'force-dynamic'` if needed

### 7. **Missing Error Boundaries**
**Location:** Throughout app
- **Issue:** No error boundaries to catch runtime errors during deployment
- **Impact:** Unhandled errors will crash the entire app
- **Fix Required:** Add error boundaries, especially around data-fetching components

### 8. **Non-null Assertions on Environment Variables**
**Location:** `lib/supabase/server.ts:13-14`, `lib/supabase/client.ts:5-6`, `lib/supabase/proxy.ts:19-20`
- **Issue:** Using `!` non-null assertion on `process.env` values without validation
- **Impact:** If env vars are missing, app will crash with undefined errors
- **Fix Required:** Add proper validation and error handling for missing env vars

### 9. **Database Table Name Case Sensitivity**
**Location:** Multiple server actions
- **Issue:** Using `"Profile"` (capital P) in queries - PostgreSQL is case-sensitive for quoted identifiers
- **Impact:** Queries will fail if table name doesn't match exactly
- **Files:**
  - `context/ProfileContext.tsx:31` - `from("Profile")`
- **Fix Required:** Verify table name casing matches database schema exactly

### 10. **Missing Supabase Redirect URL Configuration**
**Location:** `components/forgot-password-form.tsx:36`, `components/sign-up-form.tsx:48`
- **Issue:** Hardcoded redirect URLs using `window.location.origin` may not match Vercel deployment URLs
- **Impact:** Email redirects will fail if Supabase isn't configured with correct redirect URLs
- **Fix Required:** Ensure Supabase dashboard has all Vercel URLs configured (production, preview, localhost)

## 🟠 Medium Priority Issues (May Cause Build Warnings/Issues)

### 11. **Next.js Config Cache Components** ⚠️ **Next.js 16 Specific - CRITICAL**
**Location:** `next.config.ts:4`
- **Issue:** `cacheComponents: true` is known to cause **significant memory issues on Vercel builds with Next.js 16**, including `SIGKILL OOM` errors and `RangeError: Invalid string length` exceptions
- **Impact:** Builds will fail on Vercel with out-of-memory errors, even if local builds succeed
- **Fix Required:** **Remove `cacheComponents: true` immediately** or disable it for Vercel builds. This is a known Next.js 16 issue on Vercel.

### 12. **Missing TypeScript Strict Checks**
**Location:** `tsconfig.json`
- **Issue:** While `strict: true` is set, some type assertions use `any` (e.g., `context/ProfileContext.tsx:23`)
- **Impact:** Runtime type errors may occur
- **Fix Required:** Review and fix `any` types

### 13. **Package Version Pinning**
**Location:** `package.json`
- **Issue:** Using `"latest"` for critical dependencies (`next`, `@supabase/ssr`, `@supabase/supabase-js`)
- **Impact:** Builds may break if new versions introduce breaking changes
- **Fix Required:** Pin to specific versions

### 14. **Missing Build Script Validation**
**Location:** `package.json`
- **Issue:** No pre-build validation or type checking
- **Impact:** TypeScript errors may only be caught during build, causing deployment failures
- **Fix Required:** Add `"type-check": "tsc --noEmit"` and run before build

### 15. **No Health Check Endpoint**
**Location:** Missing
- **Issue:** No way to verify deployment is working correctly
- **Impact:** Harder to debug deployment issues
- **Fix Required:** Add `/api/health` route for monitoring

## 🔵 Low Priority Issues (Best Practices)

### 16. **Missing .env.example File**
**Location:** Root directory
- **Issue:** No template for environment variables
- **Impact:** Developers/deployers may miss required variables
- **Fix Required:** Create `.env.example` with all required variables

### 17. **README Outdated**
**Location:** `README.md`
- **Issue:** README references old file structure (pages/, bullets/, etc.) that doesn't match current app structure
- **Impact:** Confusing for developers
- **Fix Required:** Update README to reflect current structure

### 18. **No Deployment Documentation**
**Location:** Missing
- **Issue:** No instructions for Vercel deployment
- **Impact:** Manual setup required without guidance
- **Fix Required:** Add deployment section to README

### 19. **Missing Analytics/Monitoring**
**Location:** Throughout app
- **Issue:** No error tracking or monitoring setup
- **Impact:** Production errors may go unnoticed
- **Fix Required:** Consider adding Sentry or similar

### 20. **No CI/CD Configuration**
**Location:** Missing
- **Issue:** No automated testing before deployment
- **Impact:** Bugs may reach production
- **Fix Required:** Add GitHub Actions or similar for pre-deployment checks

## ⚠️ Additional Next.js 16 Requirements

### Node.js Version
- **Requirement:** Next.js 16 requires **Node.js 20.9+** (Node.js 18 is no longer supported)
- **Impact:** Vercel must be configured to use Node.js 20
- **Fix Required:** Set Node.js version in Vercel project settings or add `engines` field to `package.json`:
  ```json
  "engines": {
    "node": ">=20.9.0"
  }
  ```

### Turbopack Default
- **Requirement:** Next.js 16 enables Turbopack by default for `next dev` and `next build`
- **Impact:** Custom webpack configurations will cause build failures
- **Fix Required:** Remove custom webpack configs or explicitly opt-out if needed

## 📋 Pre-Deployment Checklist

Before deploying to Vercel, ensure:

- [ ] All environment variables are set in Vercel dashboard
- [ ] Environment variable names are consistent (fix issue #1)
- [ ] `hasEnvVars()` is called correctly (fix issue #3)
- [ ] Middleware is properly configured (fix issue #4)
- [ ] Supabase redirect URLs include all Vercel URLs (production + preview)
- [ ] Database schema matches code (table names, column names)
- [ ] All TypeScript errors are resolved
- [ ] Build completes successfully locally (`npm run build`)
- [ ] No console errors in browser
- [ ] Authentication flow works end-to-end
- [ ] Protected routes are properly guarded

## 🔧 Quick Fixes Summary

### Next.js 16 Critical Fixes (Do First!)
1. **Remove cacheComponents:** Delete `cacheComponents: true` from `next.config.ts` (known Vercel memory issue)
2. **Set Node.js version:** Add `"engines": { "node": ">=20.9.0" }` to `package.json`
3. **Fix middleware:** Ensure `middleware.ts` exists and exports default function (Next.js 16 requirement)

### General Critical Fixes
4. **Standardize env var name:** Decide on `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` and update all files
5. **Fix function call:** Change `if (!hasEnvVars)` to `if (!hasEnvVars())` in `lib/supabase/proxy.ts`
6. **Add env validation:** Add proper error handling for missing environment variables
7. **Create .env.example:** Document all required environment variables
8. **Update Supabase redirect URLs:** Add all Vercel deployment URLs to Supabase dashboard

## 📊 Issue Breakdown by Category

- **Next.js 16 Specific:** Issues #4, #6, #11, Node.js version requirement, Turbopack default
- **General Deployment:** Issues #2, #5, #10, #15
- **Code Bugs:** Issues #1, #3, #8, #9
- **Best Practices:** Issues #7, #12, #13, #14, #16-20
