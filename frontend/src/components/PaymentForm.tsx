import React, { useState } from 'react';
import axios from 'axios';

interface PaymentData {
  email: string;
  amount: number;
  reference: string;
}

interface PaymentResponse {
  success: boolean;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface VerificationResponse {
  success: boolean;
  data: {
    status: string;
    amount: number;
    reference: string;
    gateway_response: string;
    paid_at: string;
    customer: {
      email: string;
    };
  };
}

const PaymentForm: React.FC = () => {
  const [formData, setFormData] = useState<PaymentData>({
    email: '',
    amount: 0,
    reference: '',
  });
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const generateReference = () => {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const response = await axios.post<PaymentResponse>(
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
    } catch (error: any) {
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
      const response = await axios.post<VerificationResponse>(
        `${API_BASE_URL}/api/verify-payment`,
        { reference: formData.reference }
      );

      if (response.data.success) {
        setVerificationResult(response.data.data);
        setPaymentStatus('Payment verification completed!');
      } else {
        setPaymentStatus('Failed to verify payment');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setPaymentStatus(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Platform
          </h1>
          <p className="text-gray-600">
            Secure payments powered by Paystack
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (NGN)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount in Naira"
                min="100"
                step="100"
                required
              />
            </div>

            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                Reference (Optional)
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Payment reference (auto-generated if empty)"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={initializePayment}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Make Payment'}
              </button>

              <button
                type="button"
                onClick={verifyPayment}
                disabled={loading || !formData.reference}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Payment'}
              </button>
            </div>
          </form>

          {paymentStatus && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">{paymentStatus}</p>
            </div>
          )}

          {verificationResult && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-lg font-medium text-green-800 mb-2">Payment Details</h3>
              <div className="space-y-2 text-sm text-green-700">
                <p><strong>Status:</strong> {verificationResult.status}</p>
                <p><strong>Amount:</strong> ₦{verificationResult.amount.toLocaleString()}</p>
                <p><strong>Reference:</strong> {verificationResult.reference}</p>
                <p><strong>Response:</strong> {verificationResult.gateway_response}</p>
                {verificationResult.paid_at && (
                  <p><strong>Paid At:</strong> {new Date(verificationResult.paid_at).toLocaleString()}</p>
                )}
                <p><strong>Customer Email:</strong> {verificationResult.customer.email}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This is a demo payment platform using Paystack APIs</p>
          <p className="mt-1">Use test card: 4084 0840 8408 4081</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
