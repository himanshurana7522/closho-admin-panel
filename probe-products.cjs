const axios = require('axios');

async function checkProducts() {
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
    
    console.log("Recent products (first 3):");
    products.slice(0, 3).forEach(p => {
      console.log(`- ${p.name}`);
      console.log(`  Category: ${JSON.stringify(p.category)}`);
    });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

checkProducts();
