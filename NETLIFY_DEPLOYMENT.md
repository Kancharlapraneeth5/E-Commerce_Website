# Netlify Deployment Guide for E-Commerce Frontend

## 🚀 Deploy to Netlify

### 1. **Connect GitHub Repository**

- Go to [Netlify Dashboard](https://app.netlify.com)
- Click "New site from Git"
- Connect your GitHub repository
- Select the repository: `E-Commerce_Website`

### 2. **Configure Build Settings**

- **Site name**: `praneeth-ecommerce` (or your preferred name)
- **Branch**: `main` (or your deployment branch)
- **Base directory**: `frontend`
- **Build command**: `npm run build:prod`
- **Publish directory**: `frontend/build`

### 3. **Environment Variables** (Set in Netlify Dashboard)

Go to Site Settings → Environment Variables and add:

```
NODE_ENV=production
REACT_APP_API_URL=https://your-render-app-name.onrender.com/graphql
REACT_APP_API_BASE_URL=https://your-render-app-name.onrender.com
REACT_APP_NODE_ENV=production
REACT_APP_ENVIRONMENT=production
```

### 4. **Build Commands**

Your `package.json` already has the correct scripts:

- **Development**: `npm run start:dev`
- **Production Build**: `npm run build:prod`
- **Production Preview**: `npm run start:prod`

### 5. **Netlify Configuration File**

The `_redirects` file in `public/` handles SPA routing:

```
/*    /index.html   200
```

### 6. **Auto-Deploy**

- Netlify will automatically redeploy when you push to your connected branch
- Build logs are available in the Netlify dashboard
- Preview deployments are created for pull requests

### 7. **Custom Domain (Optional)**

- Go to Site Settings → Domain management
- Add your custom domain
- Netlify will automatically provision SSL certificates

## 🔧 Troubleshooting

### Common Issues:

1. **API Connection Error**:

   - Verify `REACT_APP_API_URL` points to your Render backend
   - Check CORS settings in backend allow your Netlify domain

2. **Build Fails**:

   - Check if all dependencies are in `package.json`
   - Verify Node.js version compatibility
   - Check build logs in Netlify dashboard

3. **Routing Issues**:

   - Ensure `_redirects` file is in `public/` folder
   - Check React Router configuration

4. **Environment Variables Not Working**:
   - Ensure variables start with `REACT_APP_`
   - Rebuild and redeploy after adding new variables

### Build Optimization:

- Production builds are automatically optimized
- Static assets are cached and served from CDN
- Bundle size analysis available in build logs

## 📱 **Testing Different Environments**

### Local Development:

```bash
npm run dev  # Uses .env.development
```

### Local Production Testing:

```bash
npm run build:prod  # Build for production
npm run start:prod   # Test production build locally
```

### Preview Deployments:

- Create a pull request to test changes
- Netlify creates a preview URL automatically

## 🔗 **Frontend-Backend Connection**

### After Backend Deployment:

1. Update environment variables in Netlify with your Render URL
2. Ensure backend CORS allows your Netlify domain
3. Test all API endpoints from frontend

### CORS Configuration:

Make sure your backend's `FRONTEND_URL` includes:

```
FRONTEND_URL=https://your-netlify-site.netlify.app
```

## 📊 **Performance & Analytics**

### Built-in Features:

- **Automatic HTTPS**: SSL certificates provided
- **Global CDN**: Fast content delivery worldwide
- **Asset Optimization**: Images and files automatically optimized
- **Analytics**: Built-in site analytics available

### Monitoring:

- Function logs (if using Netlify Functions)
- Form submissions (if using Netlify Forms)
- Bandwidth and build minute usage

## 🔄 **Deployment Workflow**

1. **Development**: Work on local development environment
2. **Testing**: Use `npm run build:prod` to test production build
3. **Commit**: Push changes to GitHub
4. **Auto-Deploy**: Netlify automatically builds and deploys
5. **Monitor**: Check deployment status in Netlify dashboard

## 📁 **File Structure**

```
frontend/
├── .env.development      # Local development variables
├── .env.production       # Production variables
├── public/
│   └── _redirects       # SPA routing configuration
├── build/               # Built files (auto-generated)
├── package.json         # Updated with environment scripts
└── src/
    ├── config/
    │   └── api.js       # Environment-aware API configuration
    └── EnvironmentBadge.js # Shows current environment
```

## 🎯 **Deployment Checklist**

### Before First Deployment:

- ✅ Environment variables configured
- ✅ Backend URL updated in production config
- ✅ CORS configured in backend
- ✅ `_redirects` file in place

### After Each Deployment:

- ✅ Test main functionality
- ✅ Verify API connections
- ✅ Check console for errors
- ✅ Test on different devices/browsers

Your frontend is now ready for seamless Netlify deployment! 🎉
