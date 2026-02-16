# Deployment Guide for Vercel

## Prerequisites
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier works fine)

## Step-by-Step Deployment

### 1. Push Your Code to Git

```bash
git init
git add .
git commit -m "Initial commit: SkillRack Competitor platform"
git remote add origin <your-git-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Fastest)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard (Recommended for beginners)

1. Go to [vercel.com](https://vercel.com) and sign in

2. Click "Add New..." → "Project"

3. Import your Git repository

4. Vercel will auto-detect the settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Click "Deploy"

Your app will be live in 2-3 minutes! 🚀

### 3. Environment Variables (Optional)

If you need to add environment variables:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add variables like:
   - `VITE_API_URL` (for code execution backend)

### 4. Custom Domain (Optional)

1. In Vercel project settings → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

## Post-Deployment Setup

### Important: Code Execution Backend

This frontend requires a backend service for code execution. You need to deploy a separate backend API that:

1. Accepts POST requests at `/run` endpoint
2. Payload: `{ code, input, language }`
3. Returns: `{ stdout, stderr, time, error }`

#### Recommended Backend Options:

1. **Judge0 API** (easiest): https://judge0.com
2. **Self-hosted Docker solution**
3. **AWS Lambda with Docker containers**
4. **Piston API**: https://github.com/engineer-man/piston

Update the `VITE_API_URL` environment variable with your backend URL.

### Setting Up Initial Data

After deployment, you need to add initial data through the admin panel:

1. **Create an Admin User**:
   - Register a new account
   - Open browser DevTools → Application → IndexedDB → skillrackdb → users
   - Edit your user record and set `admin: true`
   - Refresh the page

2. **Add Branches** (e.g., Computer Science, IT, ECE)
3. **Add Chapters** under each branch
4. **Add Questions** with test cases
5. **Create Contests** with question sets

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

Vercel will automatically build and deploy the changes.

## Monitoring

- **Analytics**: Available in Vercel dashboard
- **Error Tracking**: Check deployment logs in Vercel
- **Performance**: Use Vercel Analytics (free tier available)

## Troubleshooting

### Build Fails

Check Vercel deployment logs for specific errors. Common issues:

1. **Missing dependencies**: Ensure all imports use correct file paths
2. **Environment variables**: Make sure all required env vars are set
3. **Build timeouts**: Check for infinite loops or large assets

### Runtime Errors

1. Open browser console for JavaScript errors
2. Check IndexedDB is working (browser compatibility)
3. Verify backend API is accessible (CORS issues)

### Database Not Persisting

IndexedDB is browser-based. Each user has their own local database. For production, consider:

- Adding a real backend database (PostgreSQL, MongoDB)
- Using Firebase/Supabase for backend services

## Security Recommendations

Before going live:

1. **Implement proper authentication** (not just localStorage)
2. **Add backend database** for data persistence
3. **Secure the code execution API** with rate limiting
4. **Add HTTPS** (Vercel provides this automatically)
5. **Implement proper password hashing** (bcrypt)

## Performance Optimization

Already configured:
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Gzip compression
- ✅ CSS minification

Additional recommendations:
- Use React.lazy() for route-based code splitting
- Optimize Monaco Editor loading
- Add service worker for offline support

## Support

For issues:
- Check Vercel deployment logs
- Review browser console errors
- Check [Vite documentation](https://vitejs.dev)
- Review [Vercel documentation](https://vercel.com/docs)

---

**Your app is now ready for the world!** 🎉
