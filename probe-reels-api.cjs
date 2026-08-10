const axios = require('axios');

async function checkReelsAPI() {
  const baseURL = 'https://api-closho.onrender.com';
  try {
    const loginRes = await axios.post(`${baseURL}/admin/auth/login`, {
      email: 'groot@test.com',
      password: 'Groot@123'
    });
    const token = loginRes.data.data.accessToken || loginRes.data.data.token || loginRes.data.token;
    
    const api = axios.create({ baseURL, headers: { Authorization: `Bearer ${token}` } });
    
    console.log('--- GET /admin/reels ---');
    try {
      const reelsRes = await api.get('/admin/reels');
      console.log(JSON.stringify(reelsRes.data, null, 2));
    } catch(e) { console.log('Error GET reels:', e.response?.data || e.message); }

    console.log('\n--- GET /admin/dashboard ---');
    try {
      const dashRes = await api.get('/admin/dashboard');
      console.log(JSON.stringify(dashRes.data, null, 2).substring(0, 1000));
    } catch(e) { console.log('Error GET dashboard:', e.response?.data || e.message); }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

checkReelsAPI();
