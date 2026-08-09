const axios = require('axios');
async function test() {
  try {
    const loginRes = await axios.post('https://api-closho.onrender.com/admin/auth/login', { email: 'groot@test.com', password: 'Groot@123' });
    const token = loginRes.data.data.accessToken;
    
    const res = await axios.get('https://api-closho.onrender.com/admin/products', { headers: { Authorization: `Bearer ${token}` }});
    console.log(JSON.stringify(res.data.data[0] || res.data, null, 2));
  } catch(e) { console.error("Error", e.message); }
}
test();
