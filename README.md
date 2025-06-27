# E-Commerce Website - Full Stack Application

A modern e-commerce application built with React frontend and Node.js/GraphQL backend.

**Tech Stack**: React, Node.js, GraphQL, Express, MongoDB, TypeScript

## 🚀 **Quick Start**

### Development Mode:
```bash
npm run dev  # Runs both backend and frontend
```

### Production Mode:
```bash
npm run prod  # Runs both in production mode
```

## 📁 **Project Structure**

```
E-Commerce_Website/
├── backend/                    # Node.js + GraphQL + MongoDB
│   ├── .env.development       # Local development config
│   ├── .env.production        # Production config
│   ├── server.ts              # Main server file
│   ├── package.json           # Backend dependencies
│   └── PRODUCTION_READY.md    # Backend deployment checklist
├── frontend/                   # React + React Router
│   ├── .env.development       # Local development config
│   ├── .env.production        # Production config
│   ├── src/                   # React source code
│   ├── package.json           # Frontend dependencies
│   └── PRODUCTION_READY.md    # Frontend deployment checklist
├── FULLSTACK_DEPLOYMENT.md    # Complete deployment guide
└── package.json               # Root scripts for full-stack
```

## 🛠 **Technology Stack**

### Backend:
- **Runtime**: Node.js with TypeScript
- **API**: GraphQL with Apollo Server
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Deployment**: Render

### Frontend:
- **Framework**: React 18
- **Routing**: React Router
- **Styling**: CSS
- **Build**: Create React App
- **Deployment**: Netlify

## 🔧 **Environment Management**

The project uses environment-specific configurations:

### Development:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- Database: Local MongoDB or Atlas

### Production:
- Backend: Render deployment
- Frontend: Netlify deployment
- Database: MongoDB Atlas

## 📋 **Available Scripts**

### Root Level (Full-Stack):
- `npm run dev` - Development mode (both services)
- `npm run prod` - Production mode (both services)
- `npm run backend:dev` - Backend development only
- `npm run backend:prod` - Backend production only
- `npm run frontend:dev` - Frontend development only
- `npm run frontend:prod` - Frontend production only

### Backend:
- `npm run start:dev` - Development with nodemon
- `npm run start:prod` - Production mode
- `npm run build` - TypeScript compilation

### Frontend:
- `npm run start:dev` - Development server
- `npm run start:prod` - Production preview
- `npm run build:prod` - Production build

## 🚀 **Deployment**

### Quick Deployment:
1. **Backend**: Deploy to Render (see `RENDER_DEPLOYMENT.md`)
2. **Frontend**: Deploy to Netlify (see `frontend/NETLIFY_DEPLOYMENT.md`)
3. **Full Guide**: See `FULLSTACK_DEPLOYMENT.md`

### Environment Variables:
- Backend: Set in Render dashboard
- Frontend: Set in Netlify dashboard (must start with `REACT_APP_`)

## 🔍 **Features**

### User Features:
- **Category Management**: Users can view and add new product categories
- **Product Management**: Users can add products with descriptions, prices, and images
- **Review System**: Users can leave reviews on products to provide feedback
- **Filter Options**: Users can apply filters to refine product searches (price, category, rating)
- **Authentication**: User registration and login system
- **Responsive Design**: Works on desktop and mobile devices

### Technical Features:
- **GraphQL API**: Efficient data queries and smooth client-server interactions
- **TypeScript**: Full-stack implementation for strong typing and better maintainability
- **Environment-aware**: Separate development and production configurations
- **Auto-deployment**: Continuous deployment with GitHub integration

## 📱 **Environment Indicator**

The frontend includes a visual environment badge that shows:
- **Green** in development mode
- **Hidden** in production mode
- Current API endpoint being used

## 🔗 **API Documentation**

GraphQL endpoint: `/graphql`
- Playground available in development mode
- Production endpoint: `https://your-backend.onrender.com/graphql`

## 🛡 **Security**

- JWT-based authentication
- CORS configuration
- Environment variable protection
- MongoDB Atlas security rules

## 📊 **Monitoring**

- **Backend**: Render dashboard logs
- **Frontend**: Netlify dashboard logs
- **Database**: MongoDB Atlas monitoring

## 🤝 **Contributing**

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment files
4. Run in development: `npm run dev`
5. Make changes and test
6. Deploy using the provided guides

## 📄 **Documentation**

- `FULLSTACK_DEPLOYMENT.md` - Complete deployment workflow
- `backend/PRODUCTION_READY.md` - Backend deployment checklist
- `frontend/PRODUCTION_READY.md` - Frontend deployment checklist
- `RENDER_DEPLOYMENT.md` - Render-specific backend guide
- `frontend/NETLIFY_DEPLOYMENT.md` - Netlify-specific frontend guide

---

**Ready for production deployment!** 🎉
