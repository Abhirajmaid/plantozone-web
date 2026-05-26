# Railway Deployment Guide for Plantozone Backend

This guide will help you deploy your Strapi backend to Railway.

## Prerequisites

1. A [Railway](https://railway.app/) account
2. Railway CLI (optional but recommended): `npm install -g @railway/cli`

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended for First Deploy)

1. **Login to Railway**
   - Go to https://railway.app/
   - Sign in with your GitHub account

2. **Create a New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub repository
   - Select the repository containing this code

3. **Configure Service**
   - Railway will auto-detect your application
   - Set the root directory to `server`
   - Railway will use the `railway.json` and `nixpacks.toml` configurations

4. **Add PostgreSQL Database**
   - In your Railway project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically create a PostgreSQL database

5. **Configure Environment Variables**
   
   Click on your backend service, go to "Variables" tab, and add:

   ```
   # Server Configuration
   HOST=0.0.0.0
   PORT=${{PORT}}
   NODE_ENV=production
   
   # App Keys (Generate secure random strings)
   APP_KEYS=<generate-secure-key-1>,<generate-secure-key-2>
   API_TOKEN_SALT=<generate-secure-salt>
   ADMIN_JWT_SECRET=<generate-secure-secret>
   TRANSFER_TOKEN_SALT=<generate-secure-salt>
   JWT_SECRET=<generate-secure-secret>
   
   # Database (Railway will auto-provide these via reference variables)
   DATABASE_HOST=${{Postgres.PGHOST}}
   DATABASE_PORT=${{Postgres.PGPORT}}
   DATABASE_NAME=${{Postgres.PGDATABASE}}
   DATABASE_USER=${{Postgres.PGUSER}}
   DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
   DATABASE_SCHEMA=public
   
   # Optional: If using Cloudinary for media
   CLOUDINARY_NAME=<your-cloudinary-name>
   CLOUDINARY_KEY=<your-cloudinary-key>
   CLOUDINARY_SECRET=<your-cloudinary-secret>
   
   # Optional: If using Razorpay
   RAZORPAY_KEY_ID=<your-razorpay-key>
   RAZORPAY_KEY_SECRET=<your-razorpay-secret>
   ```

   **To generate secure keys/secrets:**
   ```bash
   # Run this in your terminal multiple times to generate different keys
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

6. **Deploy**
   - Railway will automatically build and deploy your application
   - Wait for the deployment to complete
   - Your backend will be available at the provided Railway URL

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Railway Project**
   ```bash
   cd server
   railway init
   ```

4. **Add PostgreSQL**
   ```bash
   railway add -d postgres
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set HOST=0.0.0.0
   railway variables set NODE_ENV=production
   # Add other variables as listed above
   ```

6. **Deploy**
   ```bash
   railway up
   ```

## Post-Deployment

### 1. Create Admin User
After first deployment, you'll need to create your Strapi admin user:
- Visit `https://your-railway-url.railway.app/admin`
- Create your first admin account

### 2. Configure CORS
Update `server/config/middlewares.js` to allow your frontend URL:

```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:5173', 'https://your-frontend-url.vercel.app'],
      credentials: true,
    },
  },
  // ... rest of middlewares
];
```

### 3. Update Frontend API URL
Update your client `.env` file with the Railway backend URL:
```
VITE_API_URL=https://your-railway-url.railway.app
```

## Monitoring & Logs

- View logs in Railway dashboard under "Deployments" → "Logs"
- Monitor resource usage in the "Metrics" tab
- Set up alerts in Railway settings

## Troubleshooting

### Build Fails
- Check Railway logs for specific error messages
- Ensure all dependencies are listed in `package.json`
- Verify Node.js version compatibility (18.x - 20.x)

### Database Connection Issues
- Verify database environment variables are correctly set using Railway references
- Check if database is running in Railway dashboard
- Ensure `pg` package version is compatible (8.8.0)

### App Crashes After Deploy
- Check logs for errors: `railway logs`
- Verify all required environment variables are set
- Ensure `NODE_ENV=production` is set
- Check if build command completed successfully

## Useful Commands

```bash
# View logs
railway logs

# Run commands in Railway environment
railway run npm run strapi -- help

# Open service in browser
railway open

# Link to existing project
railway link

# Check service status
railway status
```

## Migration from Supabase

Your current database configuration uses Supabase. When deploying to Railway:

1. **Option A: Continue using Supabase**
   - Keep current DATABASE_* environment variables
   - Don't add Railway PostgreSQL service
   
2. **Option B: Migrate to Railway PostgreSQL**
   - Export data from Supabase
   - Use Railway PostgreSQL database variables
   - Import data to new database

## Support

- Railway Docs: https://docs.railway.app/
- Strapi Deployment Docs: https://docs.strapi.io/dev-docs/deployment
- Railway Discord: https://discord.gg/railway

## Cost Estimation

Railway Pricing:
- Free tier: $5 credit/month (good for testing)
- Pro plan: $20/month + usage
- PostgreSQL: Included in usage costs

Monitor your usage in Railway dashboard to avoid unexpected charges.
