# Render Deployment Guide for E-Commerce Backend

## 🚀 Deploy to Render

### 1. **Connect GitHub Repository**

- Go to [Render Dashboard](https://dashboard.render.com)
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select the repository: `E-Commerce_Website`

### 2. **Configure Build Settings**

- **Name**: `e-commerce-backend` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your deployment branch)
- **Root Directory**: `backend`

### 3. **Build & Start Commands**

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 4. **Environment Variables** (Set in Render Dashboard)

```
NODE_ENV=production
DATABASE=mongodb+srv://kancharlapraneeth:qEFD3nq8A4CRgRW7@cluster0.avxtc9p.mongodb.net/GraphQL-Project?retryWrites=true&w=majority
USER=praneeth
PASSWORD=123456
JWT_SECRET=mysecret-0-mychoice/mychoice-0-mysecret-prod
FRONTEND_URL=https://praneeth-ecommerce.netlify.app
```

### 5. **Health Check**

- Render will automatically detect your app is ready when it responds to HTTP requests
- Your GraphQL endpoint will be available at: `https://your-app-name.onrender.com/graphql`

### 6. **Update Frontend Configuration**

After deployment, update your frontend's `.env.production`:

```
REACT_APP_API_URL=https://your-app-name.onrender.com/graphql
REACT_APP_API_BASE_URL=https://your-app-name.onrender.com
```

### 7. **Auto-Deploy**

- Render will automatically redeploy when you push to your connected branch
- Build logs are available in the Render dashboard

## 🔧 Troubleshooting

### Common Issues:

1. **Port Error**: Make sure your app listens on `process.env.PORT`
2. **Database Connection**: Verify MongoDB Atlas allows connections from `0.0.0.0/0`
3. **CORS Error**: Update `FRONTEND_URL` environment variable
4. **Build Fails**: Check if all dependencies are in `package.json`

### Logs:

- View build and runtime logs in Render dashboard
- Add console.log statements for debugging

## 📁 File Structure

```
backend/
├── .env.development      # Local development
├── .env.production       # Production (don't commit real secrets)
├── .env.production.example # Template
├── package.json          # Updated with build scripts
├── tsconfig.json         # TypeScript config
├── server.ts            # Updated for production
└── render.yaml          # Render configuration notes
```
