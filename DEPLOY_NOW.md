# 🚀 Deploy Your RAG Assistant NOW!

## ⚡ Quick Deploy (5 Minutes)

### Option 1: Railway (Recommended) ⭐

**Why Railway?**
- ✅ Free tier available
- ✅ SQLite works perfectly
- ✅ Automatic HTTPS
- ✅ Easy environment variables
- ✅ One-click deploy

**Steps:**

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rag-assistant.git
git push -u origin main
```

2. **Deploy to Railway**
- Go to: https://railway.app
- Click "Start a New Project"
- Select "Deploy from GitHub repo"
- Choose your repository
- Click "Deploy Now"

3. **Add Environment Variable**
- Click on your project
- Go to "Variables" tab
- Add: `GEMINI_API_KEY` = `your_api_key_here`
- Click "Deploy"

4. **Get Your URL**
- Go to "Settings" tab
- Click "Generate Domain"
- Your app is live! 🎉

**Time: ~3 minutes**

---

### Option 2: Vercel (Fastest)

**Why Vercel?**
- ✅ Fastest deployment
- ✅ Free tier
- ✅ Automatic HTTPS
- ✅ Global CDN

**Steps:**

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Follow prompts:**
- Link to existing project? No
- Project name? rag-assistant
- Directory? ./
- Override settings? No

4. **Add Environment Variable**
```bash
vercel env add GEMINI_API_KEY
```
Paste your API key when prompted.

5. **Deploy to Production**
```bash
vercel --prod
```

**Time: ~2 minutes**

---

### Option 3: Render

**Why Render?**
- ✅ Free tier
- ✅ Easy setup
- ✅ Good for production

**Steps:**

1. **Push to GitHub** (if not done)

2. **Go to Render**
- Visit: https://render.com
- Click "New +" → "Web Service"
- Connect GitHub
- Select your repository

3. **Configure**
- Name: `rag-assistant`
- Environment: `Node`
- Build Command: `npm install && npm run ingest`
- Start Command: `npm start`
- Instance Type: `Free`

4. **Add Environment Variable**
- Click "Advanced"
- Add: `GEMINI_API_KEY` = your_api_key

5. **Create Web Service**
- Click "Create Web Service"
- Wait 5-10 minutes
- Your app is live! 🎉

**Time: ~5 minutes**

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] You have a Gemini API key
- [ ] Code is committed to Git
- [ ] `.env` file is NOT committed
- [ ] `npm install` works locally
- [ ] `npm start` works locally
- [ ] `npm run ingest` works locally

---

## 🔑 Get Your Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Use it in deployment

---

## 🎯 After Deployment

### Test Your Deployment

1. **Health Check**
```bash
curl https://your-app-url.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "vectorStoreSize": 10,
  "activeSessions": 0,
  "embeddingModel": "models/gemini-embedding-001",
  "chatModel": "models/gemini-2.5-flash",
  "database": "SQLite"
}
```

2. **Test Chat**
```bash
curl -X POST https://your-app-url.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","message":"Hello"}'
```

3. **Open in Browser**
- Visit: https://your-app-url.com
- Try chatting!

---

## 🚨 Troubleshooting

### Build Fails
**Error**: "Cannot find module"
**Fix**: Make sure all dependencies are in `package.json`

### API Key Error
**Error**: "Invalid API key"
**Fix**: 
1. Check environment variable is set correctly
2. No extra spaces in the key
3. Key has proper permissions

### Database Error
**Error**: "Cannot write to database"
**Fix**: 
- Railway/Render: Should work automatically
- Vercel: Use external database (see DEPLOYMENT.md)

### Port Error
**Error**: "Port already in use"
**Fix**: Platform sets PORT automatically, no action needed

---

## 📊 Deployment Comparison

| Platform | Speed | Free Tier | SQLite | Best For |
|----------|-------|-----------|--------|----------|
| Railway | ⚡⚡⚡ | ✅ 500hrs | ✅ | Production |
| Vercel | ⚡⚡⚡⚡ | ✅ Unlimited | ❌ | Quick Demo |
| Render | ⚡⚡ | ✅ 750hrs | ✅ | Production |
| Docker | ⚡ | N/A | ✅ | Enterprise |

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Live URL (HTTPS)
- ✅ Working chat interface
- ✅ API endpoints
- ✅ Database persistence
- ✅ Automatic scaling

Share your deployed app:
- Add to portfolio
- Share on LinkedIn
- Include in resume
- Demo to recruiters

---

## 🔗 Quick Links

- **Railway**: https://railway.app
- **Vercel**: https://vercel.com
- **Render**: https://render.com
- **Gemini API**: https://aistudio.google.com/app/apikey

---

## 💡 Pro Tips

1. **Custom Domain**: Add your own domain in platform settings
2. **Monitoring**: Enable platform analytics
3. **Logs**: Check deployment logs if issues occur
4. **Scaling**: Upgrade plan if you get traffic
5. **Backup**: Keep your code on GitHub

---

## ❓ Need Help?

1. Check `DEPLOYMENT.md` for detailed guides
2. Check platform documentation
3. Review error logs
4. Test locally first

---

**Ready to deploy? Pick a platform above and follow the steps!** 🚀

**Estimated time: 2-5 minutes** ⏱️
