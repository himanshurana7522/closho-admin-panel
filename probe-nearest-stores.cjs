const axios = require('axios');

async function testNearestStores() {
  const baseURL = 'https://api-closho.onrender.com';
  try {
    const loginRes = await axios.post(`${baseURL}/admin/auth/login`, {
      email: 'groot@test.com',
      password: 'Groot@123'
    });
    const token = loginRes.data.data.accessToken || loginRes.data.data.token || loginRes.data.token;
    
    const api = axios.create({ baseURL, headers: { Authorization: `Bearer ${token}` } });
    const storesRes = await api.get('/admin/stores');
    const stores = storesRes.data.data || storesRes.data;
    
    if (stores && stores.length > 0) {
      const lat = stores[0].latitude || 28.6139;
      const lng = stores[0].longitude || 77.2090;
      
      console.log(`\nFetching nearest stores for lat: ${lat}, lng: ${lng}`);
      const nearestRes = await axios.get(`${baseURL}/stores/nearest?lat=${lat}&lng=${lng}&radius=10`);
      console.log('Nearest Stores returned to customer app:', JSON.stringify(nearestRes.data.data || nearestRes.data, null, 2).substring(0, 1000));
    }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testNearestStores();
