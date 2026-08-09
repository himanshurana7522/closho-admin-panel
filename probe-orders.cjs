const axios = require('axios');

async function testOrders() {
  const baseURL = 'https://api-closho.onrender.com';
  let token;
  try {
    const loginRes = await axios.post(`${baseURL}/admin/auth/login`, {
      email: 'groot@test.com',
      password: 'Groot@123'
    });
    token = loginRes.data.data.accessToken || loginRes.data.data.token || loginRes.data.token;
  } catch (err) {
    console.error('Login failed', err.message);
    return;
  }

  const api = axios.create({ baseURL, headers: { Authorization: `Bearer ${token}` } });

  try {
    const res = await api.get('/admin/orders', { params: { limit: 1 } });
    console.log(JSON.stringify(res.data, null, 2).substring(0, 1500));
  } catch (e) {
    console.log('Orders GET failed:', e.response?.status);
  }
}
testOrders();
