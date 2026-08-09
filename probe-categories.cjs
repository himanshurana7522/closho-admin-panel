const axios = require('axios');

async function checkCategories() {
  const baseURL = 'https://api-closho.onrender.com';
  try {
    const res = await axios.get(`${baseURL}/admin/categories`); // If public doesn't exist, I'll hit this and it might fail, but let's try with admin token
    console.log("Failed public GET");
  } catch (error) {
    const loginRes = await axios.post(`${baseURL}/admin/auth/login`, {
      email: 'groot@test.com',
      password: 'Groot@123'
    });
    const token = loginRes.data.data.accessToken || loginRes.data.data.token || loginRes.data.token;
    
    const api = axios.create({ baseURL, headers: { Authorization: `Bearer ${token}` } });
    const cRes = await api.get('/admin/categories');
    const categories = cRes.data.data || cRes.data.categories || cRes.data;
    
    console.log("Categories in DB:");
    categories.forEach(c => {
      console.log(`- ${c.name} (ID: ${c.id || c._id})`);
    });
  }
}

checkCategories();
