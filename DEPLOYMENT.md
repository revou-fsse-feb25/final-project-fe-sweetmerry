# SweetMerry Deployment Guide

This guide will help you deploy the SweetMerry Booking Management System to production.

## Prerequisites

- Node.js 18+ installed
- Git repository access
- Render account (free tier available)
- PostgreSQL database (provided by Render)

## Deployment Steps

### 1. Backend Deployment (Render)

#### Step 1: Prepare Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Update the database schema for production:
   ```bash
   # Update Prisma schema to use PostgreSQL
   # Edit prisma/schema.prisma and change:
   # datasource db {
   #   provider = "postgresql"
   #   url      = env("DATABASE_URL")
   # }
   ```

3. Commit your changes:
   ```bash
   git add .
   git commit -m "Prepare backend for deployment"
   git push origin main
   ```

#### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `sweetmerry-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Step 3: Set Environment Variables
Add these environment variables in Render:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=https://sweetmerry-frontend.onrender.com
```

#### Step 4: Create Database
1. In Render Dashboard, go to "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `sweetmerry-db`
   - **Database**: `sweetmerry_db`
   - **User**: `sweetmerry_user`
   - **Plan**: Free
3. Copy the database URL and add it as `DATABASE_URL` environment variable

#### Step 5: Deploy and Setup Database
1. Deploy the backend service
2. Once deployed, run database migrations:
   ```bash
   # In Render shell or locally with DATABASE_URL set
   npx prisma db push
   npm run seed
   ```

### 2. Frontend Deployment (Render)

#### Step 1: Prepare Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Update the API URL in environment:
   ```bash
   # Create .env file
   echo "VITE_API_URL=https://sweetmerry-backend.onrender.com/api" > .env
   ```

3. Commit your changes:
   ```bash
   git add .
   git commit -m "Prepare frontend for deployment"
   git push origin main
   ```

#### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Static Site"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `sweetmerry-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

#### Step 3: Set Environment Variables
Add this environment variable in Render:

```
VITE_API_URL=https://sweetmerry-backend.onrender.com/api
```

### 3. Alternative Deployment Options

#### Vercel (Frontend)
1. Go to [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Railway (Backend)
1. Go to [Railway](https://railway.app/)
2. Create new project from GitHub
3. Add PostgreSQL service
4. Configure environment variables
5. Deploy

#### Netlify (Frontend)
1. Go to [Netlify](https://netlify.com/)
2. Import your GitHub repository
3. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Post-Deployment Checklist

### Backend
- [ ] Health check endpoint responds: `https://your-backend.com/api/health`
- [ ] Database migrations completed
- [ ] Seed data loaded
- [ ] CORS configured correctly
- [ ] JWT tokens working
- [ ] All API endpoints responding

### Frontend
- [ ] Build successful
- [ ] API calls working
- [ ] Authentication flow working
- [ ] All pages loading correctly
- [ ] Responsive design working
- [ ] Error handling working

### Integration
- [ ] Frontend can connect to backend
- [ ] User registration/login working
- [ ] Service booking flow working
- [ ] Admin features working
- [ ] Real-time updates working

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS_ORIGIN environment variable
   - Ensure frontend URL is correct
   - Verify backend is accessible

2. **Database Connection Issues**
   - Check DATABASE_URL format
   - Verify database credentials
   - Ensure database is accessible from deployment

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors

4. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names (case-sensitive)
   - Verify values are correct

### Debug Commands

```bash
# Check backend health
curl https://your-backend.com/api/health

# Test database connection
npx prisma db push

# Check frontend build
npm run build

# Test API endpoints
curl -X POST https://your-backend.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

## Security Considerations

1. **JWT Secret**: Use a strong, unique secret
2. **Database**: Use connection pooling in production
3. **CORS**: Restrict to specific domains
4. **Rate Limiting**: Implement API rate limiting
5. **HTTPS**: Ensure all traffic uses HTTPS
6. **Environment Variables**: Never commit secrets to Git

## Monitoring

1. **Backend Logs**: Monitor application logs
2. **Database**: Monitor connection pool and queries
3. **Frontend**: Monitor build and runtime errors
4. **Performance**: Monitor response times
5. **Errors**: Set up error tracking (Sentry, etc.)

## Scaling Considerations

1. **Database**: Consider managed PostgreSQL service
2. **Caching**: Implement Redis for session storage
3. **CDN**: Use CDN for static assets
4. **Load Balancing**: Consider multiple instances
5. **Monitoring**: Implement comprehensive monitoring

## Support

For deployment issues:
1. Check the troubleshooting section
2. Review Render/Railway/Vercel documentation
3. Check application logs
4. Verify environment variables
5. Test locally with production settings
