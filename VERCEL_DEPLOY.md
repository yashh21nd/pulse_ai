# Vercel Deployment Guide for Context Bridge

## 🚀 Vercel Deployment Steps

### 1. **Install Vercel CLI** (if not already installed)
```bash
npm install -g vercel
```

### 2. **Login to Vercel**
```bash
vercel login
```

### 3. **Deploy from Command Line**
```bash
npm run deploy:vercel
```

### 4. **Or Deploy via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `yashh21nd/pulse_ai`
4. Use these settings:

## ⚙️ Vercel Project Settings

```
Framework Preset: Other
Root Directory: (leave blank)
Build Command: npm run build
Output Directory: dist/client
Install Command: npm install
```

## 🌐 Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```
NODE_ENV=production
FRONTEND_URL=https://your-project-name.vercel.app
```

## 📁 Project Structure for Vercel

```
├── api/
│   └── index.ts          ← Serverless function
├── src/
│   ├── client/           ← Frontend (React)
│   └── server/           ← API routes
├── dist/
│   └── client/           ← Built frontend
├── vercel.json           ← Vercel configuration
└── package.json
```

## 🔧 Key Features

- **Serverless Functions**: API routes run as serverless functions
- **Static Hosting**: React app served from CDN
- **Automatic HTTPS**: SSL certificates included
- **Custom Domains**: Add your own domain easily
- **Git Integration**: Auto-deploy on push to main

## 🌍 URLs After Deployment

- **App**: `https://your-project-name.vercel.app`
- **API**: `https://your-project-name.vercel.app/api/`
- **Health**: `https://your-project-name.vercel.app/api/health`

## 📊 Vercel vs Other Platforms

| Feature | Vercel | Render | Railway |
|---------|---------|---------|---------|
| **Pricing** | Free tier generous | Free tier limited | Pay-per-use |
| **Performance** | Excellent (CDN) | Good | Good |
| **Serverless** | ✅ Native | ❌ | ❌ |
| **Auto-scaling** | ✅ | ❌ | ✅ |
| **Cold starts** | ~100ms | N/A | N/A |

## 🚨 Vercel Limitations

- **Serverless**: Functions timeout after 30s (hobby plan)
- **Database**: Need external DB (not included)
- **WebSockets**: Limited support
- **File Storage**: Temporary only (use external storage)

## 🔄 Redeployment

- **Auto**: Pushes to `main` branch auto-deploy
- **Manual**: Run `vercel --prod` or redeploy in dashboard

---

**Ready to deploy to Vercel? Run `npm run deploy:vercel`!**