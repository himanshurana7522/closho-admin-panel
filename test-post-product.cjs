const axios = require('axios');
async function test() {
  try {
    const loginRes = await axios.post('https://api-closho.onrender.com/admin/auth/login', { email: 'groot@test.com', password: 'Groot@123' });
    const token = loginRes.data.data.accessToken;
    
    const payload = {
      name: "Test Report Product",
      description: "Test description that is long enough.",
      category: "test-category-id",
      basePrice: 999,
      price: 999,
      isActive: true,
      images: ["https://example.com/image.jpg"],
      variants: [ { size: "M", color: "Red", stock: 10, price: 999 } ]
    };
    
    const res = await axios.post('https://api-closho.onrender.com/admin/products', payload, { headers: { Authorization: `Bearer ${token}` }});
    console.log(JSON.stringify(res.data, null, 2));
  } catch(e) { console.error("Error", e.response?.data || e.message); }
}
test();
