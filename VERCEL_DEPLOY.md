# Vercel Deployment Guide for Context Bridge

## 🚀 Quick Deploy to Vercel

### **Option 1: One-Click Deploy**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yashh21nd/pulse_ai)

### **Option 2: Manual Deploy**

#### 1. **Install Vercel CLI** (if not installed)
```bash
npm install -g vercel
```

#### 2. **Login to Vercel**
```bash
vercel login
```

#### 3. **Deploy from Terminal**
```bash
npm run deploy:vercel
```

#### 4. **Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project" 
3. Import: `yashh21nd/pulse_ai`

## ⚙️ Project Configuration

Vercel will auto-detect settings, but verify:

```
Framework Preset: Other
Build Command: npm run build
Output Directory: dist/client
Root Directory: (leave blank)
Node.js Version: 18.x
```

## 🌐 Environment Variables

**None required!** Vercel handles URLs automatically.

Optional (in Dashboard → Settings → Environment Variables):
```
NODE_ENV=production
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