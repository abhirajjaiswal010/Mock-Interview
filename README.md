# Python Mock Interview Prep

A modern, warm-themed, distraction-free web app for practicing Python mock interview questions built with React, Vite, Tailwind CSS, and a Node.js (Express) backend.

## Features
- **Warm color palette**: Soft cream canvas, warm amber and terracotta tones for low eye strain.
- **Readable typography**: Clean, modern fonts with dedicated interview question view.
- **Python Mock Interview button**: Click to reveal interview questions, practice answering, take notes, and review key points.
- **Unified Fullstack on Vercel**: Seamlessly hosts both Vite React frontend and Express Serverless API in a single Vercel deployment.

---

## Deploying to Vercel

This repository is already configured with `vercel.json` and `/api/index.js` for single-project fullstack Vercel deployment.

### Option 1: Deploy via GitHub (Recommended)

1. **Initialize Git & Commit**:
   ```bash
   git init
   git add .
   git commit -m "feat: setup full project for Vercel deployment"
   ```
2. **Push to your GitHub repository**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
3. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository.
   - Leave the default settings (Vercel automatically detects `vercel.json`).
   - Click **Deploy**.

---

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally (if not already installed):
   ```bash
   npm i -g vercel
   ```
2. Run from the project root:
   ```bash
   vercel
   ```
3. For production deployment:
   ```bash
   vercel --prod
   ```

---

## Local Development

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Start the Node.js Server
```bash
npm run server
```
Server runs on: `http://localhost:5000`

### 3. Start the React Frontend
```bash
npm run client
```
Client runs on: `http://localhost:3000` (proxies `/api` to port 5000)
