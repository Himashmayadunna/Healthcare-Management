# Vercel Deployment Guide

## Healthcare Dashboard - Full Stack Deployment on Vercel

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub account with the project repository pushed
- Oracle Database connection details
- Node.js and npm installed locally

### Project Structure for Deployment
```
healthcare-frontend/
├── app/                    # Next.js frontend
├── backend/                # Express backend
├── public/                 # Static assets
├── vercel.json            # Vercel deployment config
├── package.json           # Root package.json
└── .env.local             # Local environment variables
```

### Step 1: Setup Vercel Account
1. Go to https://vercel.com and sign up
2. Connect your GitHub account
3. Grant access to your repository

### Step 2: Create Vercel Project
1. Click "Add New..." → "Project"
2. Select your healthcare-frontend repository
3. Vercel should auto-detect the Next.js framework

### Step 3: Configure Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_API_BASE_URL=https://your-project.vercel.app/api
DB_USER=HEALTHCARE
DB_PASSWORD=your_oracle_password
DB_CONNECT=your_oracle_host:1521/XEPDB1
PORT=3001
NODE_ENV=production
```

**Important**: Set these for "Production", "Preview", and "Development" environments as needed.

### Step 4: Deploy
1. Push your code to GitHub
2. Vercel will automatically deploy on every push to main branch
3. Monitor deployment logs in Vercel Dashboard

### Deployment Architecture

The `vercel.json` configures:

```json
{
  "experimentalServices": {
    "frontend": {
      "routePrefix": "/",
      "framework": "nextjs"
    },
    "backend": {
      "entrypoint": "backend/server.js",
      "runtime": "nodejs18.x",
      "routePrefix": "/api"
    }
  }
}
```

This means:
- **Frontend** (Next.js) → runs at root `/`
- **Backend** (Express) → runs at `/api/*` routes
- Both services deployed together as one project

### API Routes After Deployment
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-project.vercel.app/api`
- Patients: `https://your-project.vercel.app/api/patients`
- Appointments: `https://your-project.vercel.app/api/appointments`
- Prescriptions: `https://your-project.vercel.app/api/prescriptions`
- Health Check: `https://your-project.vercel.app/api/health`

### Frontend Environment Configuration

Your `NEXT_PUBLIC_API_BASE_URL` in Vercel should be set to:
```
https://your-project.vercel.app/api
```

This tells the frontend where to find the backend API after deployment.

### Database Connection

The Oracle database connection needs:
1. **DB_USER**: Your Oracle username (e.g., `HEALTHCARE`)
2. **DB_PASSWORD**: Your Oracle password
3. **DB_CONNECT**: Connection string (e.g., `hostname:1521/XEPDB1`)

Make sure your Oracle database is accessible from Vercel servers (firewall rules).

### Build & Runtime Details

- **Frontend Build**: `next build` (Next.js 16.2.4)
- **Backend Runtime**: Node.js 18.x
- **Memory**: Standard Vercel allocation
- **Cold start**: ~5-10 seconds for first request

### Monitoring Deployment

1. **Vercel Dashboard**:
   - Real-time deployment logs
   - Performance metrics
   - Analytics
   - Error tracking

2. **Check deployment status**:
   ```bash
   # Local test
   npm run build  # Verify build passes
   npm run start  # Test production server
   ```

### Troubleshooting

**Issue: Database connection fails**
- Solution: Check Oracle DB firewall allows Vercel IP ranges
- Check DB_CONNECT string format

**Issue: API returns 404**
- Solution: Verify `NEXT_PUBLIC_API_BASE_URL` matches deployed URL
- Check backend routes in `backend/routes/*.js`

**Issue: Frontend can't connect to backend**
- Solution: Check CORS configuration in `backend/server.js`
- Verify API_BASE_URL uses full URL (not relative path)

**Issue: Build fails**
- Solution: Check `npm run build` passes locally
- Verify all dependencies in package.json

### Local Deployment Testing

Before deploying to Vercel, test locally:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start
# Should run on port 3001

# Terminal 2 - Frontend
npm install
npm run build
npm run start
# Should run on port 3000
```

Then visit:
- Frontend: http://localhost:3000
- API: http://localhost:5000/api (if using local .env)

### GitHub Integration

1. Every push to `main` branch → auto-deploy
2. Pull requests → preview deployments
3. Rollbacks available in Vercel Dashboard

### Production Best Practices

1. **Environment Variables**:
   - Never commit `.env.local` to git
   - Use Vercel Environment Variables for secrets

2. **Database**:
   - Use strong passwords
   - Enable Oracle DB connection pooling
   - Monitor connection limits

3. **Monitoring**:
   - Enable Vercel Analytics
   - Setup error tracking (Sentry, etc.)
   - Monitor API response times

4. **Performance**:
   - Enable Vercel Edge Caching
   - Use Image Optimization
   - Monitor build size

### Rollback Strategy

If deployment has issues:
1. Go to Vercel Dashboard → Deployments
2. Find last successful deployment
3. Click "..." → "Redeploy"

### Support & Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Oracle Database: https://docs.oracle.com

---

**Last Updated**: May 2, 2026
**Version**: 1.0.0
