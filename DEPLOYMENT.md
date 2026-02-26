# 🚀 Deployment Guide

## Deployment Options

Your RAG assistant can be deployed to multiple platforms:

1. **Vercel** (Frontend + Serverless Backend) - Recommended for quick deployment
2. **Railway** (Full Stack) - Best for production with database
3. **Render** (Full Stack) - Alternative to Railway
4. **Docker** (Any Platform) - Maximum flexibility
5. **Heroku** (Full Stack) - Traditional PaaS

---

## 1️⃣ Vercel Deployment (Easiest)

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/rag-assistant.git
git push -u origin main
```

2. **Deploy to Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repository
- Configure:
  - Framework Preset: Other
  - Build Command: `npm install && npm run ingest`
  - Output Directory: `frontend`
  - Install Command: `npm install`

3. **Add Environment Variables**
- Go to Project Settings → Environment Variables
- Add: `GEMINI_API_KEY` = your_api_key

4. **Deploy**
- Click "Deploy"
- Your app will be live at: `https://your-project.vercel.app`

### Vercel Configuration
File: `vercel.json` (already created)

---

## 2️⃣ Railway Deployment (Recommended for Production)

### Prerequisites
- GitHub account
- Railway account (free tier available)

### Steps

1. **Push to GitHub** (if not done)
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Deploy to Railway**
- Go to https://railway.app
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

3. **Configure Environment**
- Add variable: `GEMINI_API_KEY` = your_api_key
- Add variable: `PORT` = 3000

4. **Deploy**
- Railway will automatically build and deploy
- Your app will be live at: `https://your-project.up.railway.app`

### Railway Configuration
File: `railway.json` (already created)

---

## 3️⃣ Render Deployment

### Prerequisites
- GitHub account
- Render account (free tier available)

### Steps

1. **Push to GitHub** (if not done)

2. **Deploy to Render**
- Go to https://render.com
- Click "New +" → "Web Service"
- Connect your GitHub repository

3. **Configure**
- Name: rag-assistant
- Environment: Node
- Build Command: `npm install && npm run ingest`
- Start Command: `npm start`

4. **Add Environment Variables**
- `GEMINI_API_KEY` = your_api_key
- `NODE_ENV` = production

5. **Deploy**
- Click "Create Web Service"
- Your app will be live at: `https://your-project.onrender.com`

### Render Configuration
File: `render.yaml` (already created)

---

## 4️⃣ Docker Deployment

### Prerequisites
- Docker installed
- Docker Hub account (optional)

### Steps

1. **Build Docker Image**
```bash
docker build -t rag-assistant .
```

2. **Run Locally**
```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_api_key \
  rag-assistant
```

3. **Push to Docker Hub** (optional)
```bash
docker tag rag-assistant yourusername/rag-assistant
docker push yourusername/rag-assistant
```

4. **Deploy to Any Platform**
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

### Docker Configuration
Files: `Dockerfile` and `.dockerignore` (already created)

---

## 5️⃣ Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create App**
```bash
heroku create your-rag-assistant
```

3. **Add Buildpack**
```bash
heroku buildpacks:set heroku/nodejs
```

4. **Set Environment Variables**
```bash
heroku config:set GEMINI_API_KEY=your_api_key
```

5. **Deploy**
```bash
git push heroku main
```

6. **Open App**
```bash
heroku open
```

### Heroku Configuration
Create `Procfile`:
```
web: npm start
```

---

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] `.env` file NOT committed to git
- [ ] `npm run ingest` runs successfully
- [ ] All tests pass
- [ ] Database migrations ready (if needed)
- [ ] API keys secured
- [ ] CORS configured for production domain
- [ ] Error logging configured
- [ ] Health check endpoint working

---

## 🔐 Environment Variables

Required for all deployments:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=production
```

---

## 🗄️ Database Considerations

### SQLite (Current Setup)
- ✅ Works on: Railway, Render, Docker
- ❌ Not ideal for: Vercel (serverless)

### For Vercel (Serverless)
Consider switching to:
- **Vercel Postgres** (recommended)
- **PlanetScale** (MySQL)
- **MongoDB Atlas**
- **Supabase** (PostgreSQL)

---

## 🔍 Post-Deployment Testing

1. **Health Check**
```bash
curl https://your-app.com/api/health
```

2. **Chat API**
```bash
curl -X POST https://your-app.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","message":"Hello"}'
```

3. **Frontend**
- Open: https://your-app.com
- Test chat interface
- Check console for errors

---

## 📊 Monitoring

### Recommended Tools
- **Vercel Analytics** (for Vercel)
- **Railway Metrics** (for Railway)
- **Sentry** (error tracking)
- **LogRocket** (session replay)
- **Google Analytics** (usage tracking)

---

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Verify all dependencies in package.json
- Check build logs for errors

### API Key Issues
- Verify environment variable is set
- Check API key is valid
- Ensure no extra spaces in key

### Database Issues
- For SQLite: Ensure write permissions
- For serverless: Use external database
- Check connection strings

### CORS Errors
- Update CORS configuration in server.js
- Add production domain to allowed origins

---

## 🎯 Recommended Deployment

**For Quick Demo**: Vercel
**For Production**: Railway or Render
**For Enterprise**: Docker on AWS/GCP/Azure

---

## 📝 Deployment Commands Summary

### Vercel
```bash
npm i -g vercel
vercel
```

### Railway
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

### Render
- Use web interface (no CLI needed)

### Docker
```bash
docker build -t rag-assistant .
docker run -p 3000:3000 -e GEMINI_API_KEY=key rag-assistant
```

---

## ✅ Success Criteria

Your deployment is successful when:
- ✅ Health check returns 200
- ✅ Chat API responds correctly
- ✅ Frontend loads without errors
- ✅ Database connections work
- ✅ Environment variables are set
- ✅ HTTPS is enabled
- ✅ Logs show no errors

---

## 🔗 Useful Links

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Docker Docs**: https://docs.docker.com
- **Heroku Docs**: https://devcenter.heroku.com

---

## 🎉 Next Steps After Deployment

1. Add custom domain
2. Set up monitoring
3. Configure CI/CD
4. Add rate limiting
5. Implement caching
6. Set up backups
7. Add authentication (if needed)

---

**Need Help?** Check the troubleshooting section or create an issue on GitHub.
