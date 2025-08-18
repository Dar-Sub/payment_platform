import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    amount: 0,
    reference: '',
  });
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  // Use relative URL for Vercel deployment (same domain for frontend and backend)
  const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

  const generateReference = () => {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const initializePayment = async () => {
    if (!formData.email || formData.amount <= 0) {
      alert('Please fill in all fields and enter a valid amount');
      return;
    }

    setLoading(true);
    setPaymentStatus('Initializing payment...');

    try {
      const paymentData = {
        ...formData,
        reference: formData.reference || generateReference(),
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/initialize-payment`,
        paymentData
      );

      if (response.data.success) {
        setPaymentStatus('Payment initialized successfully!');
        // Redirect to Paystack payment page
        window.location.href = response.data.data.authorization_url;
      } else {
        setPaymentStatus('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setPaymentStatus(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    if (!formData.reference) {
      alert('Please enter a reference number to verify');
      return;
    }

    setLoading(true);
    setPaymentStatus('Verifying payment...');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/verify-payment`,
        { reference: formData.reference }
      );

      if (response.data.success) {
        setVerificationResult(response.data.data);
        setPaymentStatus('Payment verification completed!');
      } else {
        setPaymentStatus('Failed to verify payment');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animated-bg min-h-screen py-6 px-4 sm:px-6 lg:px-8 relative">
      {/* Subtle Particle System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle" style={{ top: '10%', left: '10%' }}></div>
        <div className="particle" style={{ top: '20%', right: '15%' }}></div>
        <div className="particle" style={{ bottom: '30%', left: '20%' }}></div>
        <div className="particle" style={{ bottom: '20%', right: '10%' }}></div>
        <div className="particle" style={{ top: '50%', left: '5%' }}></div>
        <div className="particle" style={{ top: '70%', right: '25%' }}></div>
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-slate-400 rounded-full opacity-20 float-animation"></div>
        <div className="absolute top-40 right-20 w-4 h-4 bg-slate-500 rounded-full opacity-15 float-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-slate-300 rounded-full opacity-25 float-animation" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-slate-400 rounded-full opacity-20 float-animation" style={{animationDelay: '6s'}}></div>
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        {/* Compact Professional Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-700 bg-opacity-50 backdrop-blur-sm mb-4 border-gradient professional-hover">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white text-glow mb-2 tracking-tight">
            Payment Platform
          </h1>
          <p className="text-white text-opacity-70 text-sm font-light">
            Professional payments powered by <span className="text-tech font-semibold">Paystack</span>
          </p>
        </div>

        {/* Compact Main Professional Card */}
        <div className="glass-card rounded-2xl p-6 glow-effect">
          <form className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold text-white text-glow tracking-wide uppercase">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="tech-input w-full px-4 py-3 rounded-xl text-white placeholder-white placeholder-opacity-40 text-base"
                  placeholder="Enter your email address"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-white text-opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Amount Field */}
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-xs font-semibold text-white text-glow tracking-wide uppercase">
                Amount (NGN)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="tech-input w-full px-4 py-3 rounded-xl text-white placeholder-white placeholder-opacity-40 text-base"
                  placeholder="Enter amount in Naira"
                  min="100"
                  step="100"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-white text-opacity-40 font-semibold text-base">₦</span>
                </div>
              </div>
            </div>

            {/* Reference Field */}
            <div className="space-y-2">
              <label htmlFor="reference" className="block text-xs font-semibold text-white text-glow tracking-wide uppercase">
                Reference (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className="tech-input w-full px-4 py-3 rounded-xl text-white placeholder-white placeholder-opacity-40 text-base"
                  placeholder="Payment reference (auto-generated if empty)"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-white text-opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={initializePayment}
                disabled={loading}
                className="neon-button flex-1 text-white py-3 px-4 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Make Payment'
                )}
              </button>

              <button
                type="button"
                onClick={verifyPayment}
                disabled={loading || !formData.reference}
                className="flex-1 bg-white bg-opacity-10 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-opacity-20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white border-opacity-20"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Payment'
                )}
              </button>
            </div>
          </form>

          {/* Compact Status Messages */}
          {paymentStatus && (
            <div className="mt-4 p-3 rounded-xl status-info">
              <div className="flex items-center">
                <div className="pulse-animation w-2 h-2 bg-slate-400 rounded-full mr-3"></div>
                <p className="text-white text-xs font-medium">{paymentStatus}</p>
              </div>
            </div>
          )}

          {/* Compact Verification Results */}
          {verificationResult && (
            <div className="mt-4 p-4 rounded-xl status-success">
              <h3 className="text-sm font-semibold text-green-300 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Payment Details
              </h3>
              <div className="space-y-2 text-xs text-green-200">
                <div className="flex justify-between items-center py-1 border-b border-green-300 border-opacity-20">
                  <span className="font-semibold">Status:</span>
                  <span className="text-green-300 font-medium">{verificationResult.status}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-green-300 border-opacity-20">
                  <span className="font-semibold">Amount:</span>
                  <span className="text-green-300 font-medium">₦{verificationResult.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-green-300 border-opacity-20">
                  <span className="font-semibold">Reference:</span>
                  <span className="text-green-300 font-mono text-xs bg-green-900 bg-opacity-30 px-2 py-1 rounded">{verificationResult.reference}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-green-300 border-opacity-20">
                  <span className="font-semibold">Response:</span>
                  <span className="text-green-300 font-medium">{verificationResult.gateway_response}</span>
                </div>
                {verificationResult.paid_at && (
                  <div className="flex justify-between items-center py-1 border-b border-green-300 border-opacity-20">
                    <span className="font-semibold">Paid At:</span>
                    <span className="text-green-300 font-medium">{new Date(verificationResult.paid_at).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold">Customer Email:</span>
                  <span className="text-green-300 font-medium">{verificationResult.customer.email}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Compact Professional Footer */}
        <div className="mt-6 text-center">
          <div className="glass-card rounded-xl p-4 border-gradient">
            <p className="text-white text-opacity-70 text-xs mb-2 font-light">
              Professional payment processing platform
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-3 h-3 text-white text-opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white text-opacity-50 text-xs font-mono tracking-wide">
                  Test Card: 4084 0840 8408 4081
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4 text-white text-opacity-40 text-xs font-mono">
                <span>CVV: 408</span>
                <span>Expiry: 01/25</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
