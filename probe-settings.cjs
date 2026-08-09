const axios = require('axios');

async function testSettings() {
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
    const p = await api.get('/admin/settings/payments');
    console.log('Payments Settings:', p.data);
  } catch (e) {
    console.log('Payments GET failed:', e.response?.status);
  }
  
  try {
    const c = await api.get('/admin/settings/config');
    console.log('Config Settings:', c.data);
  } catch (e) {
    console.log('Config GET failed:', e.response?.status);
  }
}
testSettings();
