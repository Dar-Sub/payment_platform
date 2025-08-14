# Payment Platform - Deployment Guide

## 🚀 Quick Deployment to Vercel

### Prerequisites
1. **Paystack Account**: Sign up at [paystack.com](https://paystack.com)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Account**: For code hosting

### Step 1: Get Paystack API Keys

1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Navigate to Settings → API Keys & Webhooks
3. Copy your **Secret Key** (starts with `sk_test_` for testing)
4. Copy your **Public Key** (starts with `pk_test_` for testing)

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod
```

#### Option B: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Other
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `npm run install-all`

### Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to Settings → Environment Variables
2. Add the following variables:

```
PAYSTACK_SECRET_KEY=sk_test_your_actual_secret_key_here
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

### Step 4: Update Frontend API URL

Update the frontend to use the deployed backend URL:

```typescript
// In frontend/src/components/PaymentForm.tsx
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

## 🔧 Alternative Deployment Options

### Netlify Deployment

1. **Deploy Frontend**:
   ```bash
   cd frontend
   npm run build
   # Drag and drop build folder to Netlify
   ```

2. **Deploy Backend**:
   - Use Vercel, Heroku, or Railway for the backend
   - Update frontend API URL accordingly

### Heroku Deployment

1. **Install Heroku CLI**:
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   heroku create your-payment-api
   heroku config:set PAYSTACK_SECRET_KEY=sk_test_your_key
   git push heroku main
   ```

3. **Deploy Frontend**:
   ```bash
   cd frontend
   heroku create your-payment-frontend
   heroku config:set REACT_APP_API_URL=https://your-backend-url.herokuapp.com
   git push heroku main
   ```

## 🧪 Testing Your Deployment

### 1. Test Health Endpoint
```bash
curl https://your-backend-url.vercel.app/api/health
```

### 2. Test Payment Flow
1. Open your deployed frontend URL
2. Enter test email: `test@example.com`
3. Enter amount: `1000`
4. Click "Make Payment"
5. Use test card: `4084 0840 8408 4081`

### 3. Test Cards for Development
- **Visa**: `4084 0840 8408 4081`
- **Mastercard**: `5105 1051 0510 5100`
- **Verve**: `5061 0000 0000 0000`

## 🔒 Security Considerations

1. **Environment Variables**: Never commit API keys to Git
2. **CORS**: Backend is configured to accept requests from any origin (update for production)
3. **HTTPS**: Always use HTTPS in production
4. **API Key Rotation**: Regularly rotate your Paystack API keys

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics in your project dashboard
- Monitor API performance and errors

### Paystack Dashboard
- Monitor transactions in Paystack dashboard
- Set up webhooks for real-time notifications

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure backend CORS is configured correctly
   - Check frontend API URL is correct

2. **API Key Errors**:
   - Verify Paystack secret key is correct
   - Ensure key is for the right environment (test/live)

3. **Build Failures**:
   - Check all dependencies are installed
   - Verify TypeScript compilation

### Debug Commands

```bash
# Test backend locally
cd backend && npm run dev

# Test frontend locally
cd frontend && npm start

# Run API tests
cd backend && node test-payment.js
```

## 📞 Support

- **Paystack Support**: [support.paystack.com](https://support.paystack.com)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Project Issues**: Create an issue in the GitHub repository

## 🎯 Next Steps

1. **Production Setup**: Switch to Paystack live keys
2. **Webhook Integration**: Add webhook handling for payment notifications
3. **Database Integration**: Add transaction storage
4. **User Authentication**: Implement user accounts
5. **Analytics**: Add payment analytics and reporting
