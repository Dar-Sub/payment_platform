# Payment Platform - Paystack Integration

A modern payment platform built with React, Node.js, and Paystack APIs. This project demonstrates the implementation of payment processing using Paystack's payment gateway.

## Features

- **Payment Initialization**: Create payment transactions using Paystack's Initialize Transaction API
- **Payment Verification**: Verify payment status using Paystack's Verify Transaction API
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Professional Design**: Sophisticated dark theme with glass morphism effects
- **Real-time Status**: Live payment status updates and verification results
- **Single-page Experience**: Compact design that fits on one screen

## Tech Stack

### Frontend
- React 18 with JavaScript
- Tailwind CSS for styling
- Axios for API communication
- Professional dark theme with animations

### Backend
- Node.js with Express
- Paystack API integration
- CORS enabled for cross-origin requests
- Environment variable management

## APIs Implemented

1. **Initialize Transaction API** (`POST /api/initialize-payment`)
   - Creates a new payment transaction
   - Returns authorization URL for payment completion
   - Supports NGN currency with proper validation

2. **Verify Transaction API** (`POST /api/verify-payment`)
   - Verifies payment status using transaction reference
   - Returns detailed transaction information
   - Handles kobo to naira conversion

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Paystack account with API keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dar-Sub/payment_platform.git
   cd payment_platform
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Setup Environment Variables**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env and add your Paystack secret key
   ```

4. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Variables

Create a `.env` file in the backend directory:

```env
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
PORT=5000
```

## Usage

1. **Make a Payment**
   - Enter your email address
   - Specify the amount in Naira (NGN)
   - Optionally provide a reference number
   - Click "Make Payment" to initialize the transaction
   - You'll be redirected to Paystack's payment page

2. **Verify Payment**
   - Enter the transaction reference number
   - Click "Verify Payment" to check the payment status
   - View detailed transaction information

## Test Cards

For testing purposes, use these Paystack test cards:

- **Card Number**: 4084 0840 8408 4081
- **CVV**: 408
- **Expiry**: 01/25 (or any future date)

## API Endpoints

### Backend API

- `GET /api/health` - Health check endpoint
- `POST /api/initialize-payment` - Initialize a new payment
- `POST /api/verify-payment` - Verify payment status

### Request/Response Examples

**Initialize Payment:**
```json
POST /api/initialize-payment
{
  "email": "customer@example.com",
  "amount": 5000,
  "reference": "PAY-123456789"
}
```

**Verify Payment:**
```json
POST /api/verify-payment
{
  "reference": "PAY-123456789"
}
```

## Deployment

### Vercel Deployment (Recommended)

The project includes `vercel.json` configuration for easy deployment:

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   - Add `PAYSTACK_SECRET_KEY` in Vercel dashboard

### Alternative Deployment Options

- **Netlify**: Frontend deployment with API proxy
- **Heroku**: Full-stack deployment with Procfile

## Project Structure

```
payment_platform/
├── backend/
│   ├── server.js          # Express server with Paystack integration
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── PaymentForm.js  # Main payment component
│   │   ├── App.js         # Main app component
│   │   └── index.css      # Tailwind CSS with animations
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── package.json           # Root package.json with scripts
├── vercel.json           # Vercel deployment configuration
└── README.md             # Project documentation
```

## Security Considerations

- API keys are stored in environment variables
- CORS is properly configured
- Input validation is implemented
- Error handling for API failures
- Secure payment processing with Paystack

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For technical support or questions about Paystack integration, please refer to:
- [Paystack Documentation](https://paystack.com/docs)
- [Paystack API Reference](https://paystack.com/docs/api)
