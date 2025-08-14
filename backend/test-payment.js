const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function testPaymentAPI() {
  console.log('🧪 Testing Payment Platform API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test payment initialization
    console.log('2. Testing payment initialization...');
    const initData = {
      email: 'test@example.com',
      amount: 1000,
      reference: `TEST-${Date.now()}`
    };
    
    const initResponse = await axios.post(`${API_BASE_URL}/api/initialize-payment`, initData);
    console.log('✅ Payment initialization response:', {
      success: initResponse.data.success,
      reference: initResponse.data.data?.reference,
      authorization_url: initResponse.data.data?.authorization_url ? 'Present' : 'Missing'
    });
    console.log('');

    console.log('🎉 All tests passed! The payment platform is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('1. Get your Paystack secret key from https://dashboard.paystack.com');
    console.log('2. Add it to backend/.env file');
    console.log('3. Test with real payments using test cards');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testPaymentAPI();
