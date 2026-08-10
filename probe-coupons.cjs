const axios = require('axios');

async function checkCoupons() {
  const baseURL = 'https://api-closho.onrender.com';
  try {
    const loginRes = await axios.post(`${baseURL}/admin/auth/login`, {
      email: 'groot@test.com',
      password: 'Groot@123'
    });
    const token = loginRes.data.data.accessToken || loginRes.data.data.token || loginRes.data.token;
    
    const api = axios.create({ baseURL, headers: { Authorization: `Bearer ${token}` } });
    const res = await api.get('/admin/coupons');
    console.log("Coupons in DB:", JSON.stringify(res.data, null, 2));
  } catch (error) {
    console.error('Error fetching coupons:', error.response?.data || error.message);
  }
}

checkCoupons();
