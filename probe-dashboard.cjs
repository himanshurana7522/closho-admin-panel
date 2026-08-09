const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('https://api-closho.onrender.com/admin/auth/login', { email: 'groot@test.com', password: 'Groot@123' });
    const token = loginRes.data.data.accessToken;
    const headers = { Authorization: `Bearer ${token}` };

    const endpoints = [
      '/admin/dashboard',
      '/admin/dashboard/stats',
      '/admin/stats',
      '/admin/reports/sales',
      '/admin/sales'
    ];

    for (const ep of endpoints) {
      console.log(`\n--- Testing GET ${ep} ---`);
      try {
        const res = await axios.get(`https://api-closho.onrender.com${ep}`, { headers });
        console.log(`Success: ${res.status}`);
        console.log(JSON.stringify(res.data, null, 2).substring(0, 500) + '...');
      } catch(e) { 
        console.log(`Error: ${e.response?.status} - ${e.response?.data?.message || 'Unknown error'}`); 
      }
    }
  } catch(e) {
    console.error("Auth Error", e.message);
  }
}
test();
