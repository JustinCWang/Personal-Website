# Deployment Guide for Vercel

This guide will help you deploy your Personal Website to Vercel with both frontend and backend functionality.

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **MongoDB Atlas Account**: Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
3. **Vercel Account**: Create a free account at [Vercel](https://vercel.com)

## Step 1: Set up MongoDB Atlas (Cloud Database)

1. Create a new cluster in MongoDB Atlas
2. Create a database user with read/write permissions
3. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/personal-website`)
4. Whitelist all IP addresses (0.0.0.0/0) for development, or specific IPs for production

## Step 2: Prepare Your Repository

1. Make sure all files are committed and pushed to GitHub
2. Move your profile image to `frontend/public/professionalpic.jpg` (remove the `/public` from the path)

## Step 3: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it as a Node.js project

### Configure Environment Variables

In your Vercel project settings, add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-website
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

**Important**: 
- Replace the MongoDB URI with your actual Atlas connection string
- Generate a strong JWT secret (use a random string generator)

## Step 4: Update CORS Settings

After deployment, update the CORS origin in `backend/server.js` line 25:

```javascript
origin: [
  'http://localhost:5173', 
  'http://localhost:3000',
  'https://your-actual-vercel-domain.vercel.app'  // Replace with your actual domain
],
```

## Step 5: Test Your Deployment

1. Visit your Vercel domain
2. Test the landing page
3. Try logging in (create an account first)
4. Test creating/editing projects
5. Check that featured projects appear on the landing page

## Common Issues and Solutions

### Issue: "Module not found" errors
**Solution**: Make sure all import paths use explicit file extensions (.tsx, .ts)

### Issue: Database connection fails
**Solution**: 
- Check your MongoDB Atlas connection string
- Ensure IP whitelist includes 0.0.0.0/0
- Verify database user permissions

### Issue: API requests fail
**Solution**:
- Check environment variables are set in Vercel
- Verify CORS settings include your Vercel domain

### Issue: Images not loading
**Solution**: 
- Move images to `frontend/public/` directory
- Update image paths to start from root (e.g., `/professionalpic.jpg`)

## Useful Commands

```bash
# Test build locally (frontend)
cd frontend && npm run build

# Test the built frontend
cd frontend && npm run preview

# Check for TypeScript errors
cd frontend && npx tsc --noEmit
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-here` |
| `NODE_ENV` | Environment mode | `production` |

## Next Steps

1. **Custom Domain**: Add a custom domain in Vercel settings
2. **SSL Certificate**: Vercel provides automatic HTTPS
3. **Analytics**: Enable Vercel Analytics for usage insights
4. **Monitoring**: Set up error tracking and monitoring

## Support

If you encounter issues:
1. Check Vercel build logs
2. Review browser console for frontend errors
3. Check Vercel function logs for backend errors
4. Ensure all environment variables are properly set 