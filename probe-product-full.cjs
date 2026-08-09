const axios = require('axios');

async function testFullProduct() {
  const baseURL = 'https://api-closho.onrender.com';
  try {
    const loginRes = await axios.post(`${baseURL}/admin/auth/login`, {
      email: 'groot@test.com',
      password: 'Groot@123'
    });
    const token = loginRes.data.data.accessToken || loginRes.data.data.token || loginRes.data.token;
    
    const api = axios.create({ baseURL, headers: { Authorization: `Bearer ${token}` } });
    const pRes = await api.get('/admin/products');
    const products = pRes.data.data || pRes.data.products || pRes.data;
    
    if (products.length > 0) {
      console.log('Full Product 0:');
      console.log(JSON.stringify(products[0], null, 2));
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testFullProduct();
