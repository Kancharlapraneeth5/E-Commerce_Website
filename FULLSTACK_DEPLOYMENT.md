# Full-Stack Deployment Workflow

## 🚀 **Complete Deployment Guide**

This guide covers deploying both your backend (to Render) and frontend (to Netlify) for your E-Commerce project.

## 📋 **Deployment Order**

### Phase 1: Backend Deployment (Render)

1. Deploy backend first to get the production API URL
2. Backend provides the GraphQL endpoint for frontend

### Phase 2: Frontend Deployment (Netlify)

1. Update frontend with backend URL
2. Deploy frontend with correct API configuration

---

## 🔧 **Phase 1: Backend Deployment**

### 1. **Prepare Backend**

```bash
cd backend
npm run build  # Test TypeScript compilation
npm run start:prod  # Test production mode locally
```

### 2. **Deploy to Render**

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create new Web Service from GitHub
3. Configure:
   - **Repository**: `E-Commerce_Website`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 3. **Set Environment Variables in Render**

```
NODE_ENV=production
DATABASE=mongodb+srv://kancharlapraneeth:qEFD3nq8A4CRgRW7@cluster0.avxtc9p.mongodb.net/GraphQL-Project?retryWrites=true&w=majority
USER=praneeth
PASSWORD=123456
JWT_SECRET=mysecret-0-mychoice/mychoice-0-mysecret-prod
FRONTEND_URL=https://praneeth-ecommerce.netlify.app
```

### 4. **Test Backend**

- Wait for deployment to complete
- Note your backend URL: `https://your-backend-name.onrender.com`
- Test GraphQL endpoint: `https://your-backend-name.onrender.com/graphql`

---

## 🎨 **Phase 2: Frontend Deployment**

### 1. **Update Frontend Configuration**

Update `frontend/.env.production` with your Render backend URL:

```
REACT_APP_API_URL=https://your-backend-name.onrender.com/graphql
REACT_APP_API_BASE_URL=https://your-backend-name.onrender.com
REACT_APP_NODE_ENV=production
REACT_APP_ENVIRONMENT=production
```

### 2. **Test Frontend Locally**

```bash
cd frontend
npm run build:prod  # Build for production
npx serve -s build  # Test production build locally
```

### 3. **Deploy to Netlify**

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Create new site from Git
3. Configure:
   - **Repository**: `E-Commerce_Website`
   - **Base Directory**: `frontend`
   - **Build Command**: `npm run build:prod`
   - **Publish Directory**: `frontend/build`

### 4. **Set Environment Variables in Netlify**

```
NODE_ENV=production
REACT_APP_API_URL=https://your-backend-name.onrender.com/graphql
REACT_APP_API_BASE_URL=https://your-backend-name.onrender.com
REACT_APP_NODE_ENV=production
REACT_APP_ENVIRONMENT=production
```

---

## 🔄 **Update Backend CORS**

After getting your Netlify URL, update backend environment variables:

1. Go to Render Dashboard → Your Backend Service → Environment
2. Update `FRONTEND_URL` to your Netlify URL:
   ```
   FRONTEND_URL=https://your-site-name.netlify.app
   ```
3. Redeploy backend service

---

## ✅ **Testing Full-Stack Deployment**

### 1. **Backend Tests**

- [ ] GraphQL endpoint responds: `https://your-backend.onrender.com/graphql`
- [ ] Database connection working
- [ ] Environment variables loaded correctly
- [ ] CORS allows your frontend domain

### 2. **Frontend Tests**

- [ ] Site loads: `https://your-site.netlify.app`
- [ ] API calls work (check browser console)
- [ ] All features functional
- [ ] No CORS errors
- [ ] Environment badge hidden in production

### 3. **Integration Tests**

- [ ] User registration works
- [ ] User login works
- [ ] Products load from backend
- [ ] Categories load from backend
- [ ] Reviews can be added
- [ ] All GraphQL mutations work

---

## 🛠 **Development Workflow**

### Daily Development:

```bash
# In project root
npm run dev  # Runs both backend and frontend in development
```

### Testing Production Locally:

```bash
# Backend
cd backend && npm run start:prod

# Frontend (in new terminal)
cd frontend && npm run build:prod && npx serve -s build
```

### Deployment:

1. **Commit and push** to GitHub
2. **Backend** auto-deploys on Render
3. **Frontend** auto-deploys on Netlify
4. **Test** both services

---

## 📊 **Monitoring & Maintenance**

### Backend (Render):

- Monitor logs in Render dashboard
- Check for database connection issues
- Monitor API response times
- Watch for memory/CPU usage

### Frontend (Netlify):

- Monitor build logs
- Check for JavaScript errors
- Monitor site performance
- Review analytics

### Database (MongoDB Atlas):

- Monitor connection usage
- Check database performance
- Review security settings
- Monitor storage usage

---

## 🚨 **Troubleshooting**

### Common Issues:

1. **CORS Errors**:

   - Update `FRONTEND_URL` in backend
   - Redeploy backend after URL changes

2. **Environment Variables Not Working**:

   - Frontend: Must start with `REACT_APP_`
   - Backend: Check spelling and restart service

3. **Build Failures**:

   - Check Node.js version compatibility
   - Verify all dependencies in package.json
   - Review build logs for specific errors

4. **Database Connection Issues**:
   - Verify MongoDB Atlas allows 0.0.0.0/0
   - Check connection string format
   - Verify database credentials

---

## 🎯 **Quick Commands Reference**

### Development:

```bash
npm run dev           # Full-stack development
npm run backend:dev   # Backend only
npm run frontend:dev  # Frontend only
```

### Production Testing:

```bash
npm run prod          # Full-stack production mode
npm run backend:prod  # Backend production
npm run frontend:prod # Frontend production
```

### Building:

```bash
cd backend && npm run build    # Build backend
cd frontend && npm run build:prod  # Build frontend
```

Your full-stack application is now ready for production deployment! 🎉
