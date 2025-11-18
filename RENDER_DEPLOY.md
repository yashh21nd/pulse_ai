# Render Deployment Guide for Context Bridge

## 🚀 Quick Deploy Steps

### 1. Prepare Your Repository
Make sure your code is pushed to GitHub (which it appears to be: yashh21nd/pulse_ai).

### 2. Create Render Account
- Go to [render.com](https://render.com)
- Sign up/login with your GitHub account

### 3. Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `yashh21nd/pulse_ai`
3. Select the branch: `main`

### 4. Configure Build & Deploy Settings
```
Name: context-bridge
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: (leave blank)
Runtime: Node
Build Command: npm install && npm run build:prod
Start Command: npm start
```

### 5. Environment Variables
Add these in the Render dashboard:
```
NODE_ENV=production
FRONTEND_URL=https://context-bridge.onrender.com
```

### 6. Advanced Settings
- **Auto-Deploy**: Enable (deploys on every push to main)
- **Health Check Path**: `/api/health`
- **Instance Type**: Free (or upgrade as needed)

## 📋 Pre-Deployment Checklist

✅ Code is in GitHub repository
✅ `package.json` has correct build scripts
✅ Server serves static files in production
✅ Environment variables are configured
✅ Health check endpoint exists (`/api/health`)

## 🔧 Local Testing (Before Deploy)

Test production build locally:
```bash
npm run build
npm start
```

Visit: http://localhost:10000

## 🌐 After Deployment

1. Your app will be available at: `https://your-service-name.onrender.com`
2. API endpoints at: `https://your-service-name.onrender.com/api/`
3. Health check: `https://your-service-name.onrender.com/api/health`

## 🔍 Monitoring & Logs

- **Logs**: Available in Render dashboard
- **Metrics**: CPU, Memory usage in dashboard
- **Deployments**: View build logs and deployment history

## ⚠️ Free Tier Limitations

- Service spins down after 15 minutes of inactivity
- 750 build hours/month
- Cold starts may take 10-30 seconds

## 🚨 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation works locally

### App Won't Start
- Check start command: `npm start`
- Verify `dist/server/index.js` exists after build
- Check environment variables

### Static Files Not Served
- Ensure build creates `dist/client` directory
- Server should serve static files in production mode

## 🔄 Redeployment

Auto-deploys on every push to `main` branch, or manually trigger in dashboard.

---

**Ready to deploy? Push your code and create the Render service!**