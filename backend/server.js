const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://payment-platform-two.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Debug: Log environment info (without exposing the actual key)
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  HAS_PAYSTACK_KEY: !!PAYSTACK_SECRET_KEY,
  KEY_STARTS_WITH: PAYSTACK_SECRET_KEY ? PAYSTACK_SECRET_KEY.substring(0, 7) + '...' : 'NOT_SET'
});

// Initialize Payment
app.post('/api/initialize-payment', async (req, res) => {
  try {
    // Check if API key is available
    if (!PAYSTACK_SECRET_KEY) {
      console.error('PAYSTACK_SECRET_KEY is not set');
      return res.status(500).json({
        success: false,
        message: 'Payment service configuration error',
        error: 'API key not configured'
      });
    }

    const { email, amount, reference } = req.body;
    
    console.log('Initializing payment with:', {
      email,
      amount,
      reference,
      hasKey: !!PAYSTACK_SECRET_KEY
    });
    
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // Convert to kobo (smallest currency unit)
        reference,
        currency: 'NGN', // Specify Nigerian Naira currency
        callback_url: process.env.NODE_ENV === 'production' 
          ? 'https://payment-platform-two.vercel.app/api/verify-payment'
          : `${req.protocol}://${req.get('host')}/api/verify-payment`,
      },
      {
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      success: true,
      data: response.data.data,
    });
  } catch (error) {
    console.error('Payment initialization error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.response?.data || error.message,
    });
  }
});

// Verify Payment
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { reference } = req.body;
    
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const transaction = response.data.data;
    
    res.json({
      success: true,
      data: {
        status: transaction.status,
        amount: transaction.amount / 100, // Convert from kobo to naira
        reference: transaction.reference,
        gateway_response: transaction.gateway_response,
        paid_at: transaction.paid_at,
        customer: transaction.customer,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.response?.data || error.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Payment API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
