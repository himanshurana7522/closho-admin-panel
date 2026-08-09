const axios = require('axios');
async function test() {
  try {
    const loginRes = await axios.post('https://api-closho.onrender.com/admin/auth/login', { email: 'groot@test.com', password: 'Groot@123' });
    const token = loginRes.data.data.accessToken;
    
    const res = await axios.get('https://api-closho.onrender.com/admin/products', { headers: { Authorization: `Bearer ${token}` }});
    const products = res.data.data || res.data;
    console.log(`Total Products Count: ${products.length}`);
    console.log("Sample of first 2 products:");
    console.log(JSON.stringify(products.slice(0, 2), null, 2));
  } catch(e) { console.error("Error", e.message); }
}
test();
