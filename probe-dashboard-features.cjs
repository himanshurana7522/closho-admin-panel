const axios = require('axios');

async function testAPIs() {
  const baseURL = 'https://api-closho.onrender.com';
  console.log('Logging in as Admin...');
  let token;
  try {
    const loginRes = await axios.post(`${baseURL}/admin/auth/login`, {
      email: 'groot@test.com',
      password: 'Groot@123'
    });
    token = loginRes.data.data.accessToken || loginRes.data.data.token || loginRes.data.token;
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
    return;
  }

  const api = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${token}` }
  });

  // Get a real store ID
  let storeId = 'test';
  try {
    const storesRes = await api.get('/admin/stores');
    const stores = storesRes.data.data || storesRes.data.stores || storesRes.data;
    if (stores && stores.length > 0) {
      storeId = stores[0].id || stores[0]._id;
      console.log('Found valid store ID for testing:', storeId);
    }
  } catch (e) {
    console.log('Failed to fetch stores to get a valid ID');
  }

  const endpointsToTest = [
    { name: 'Admin Dashboard (Global)', method: 'get', url: '/admin/dashboard' },
    { name: 'Admin Dashboard (Store Specific)', method: 'get', url: `/admin/dashboard?storeId=${storeId}` },
    { name: 'Sales Report', method: 'get', url: '/admin/reports/sales' },
    { name: 'Sales Report (Store Specific)', method: 'get', url: `/admin/reports/sales?storeId=${storeId}` },
    { name: 'Admin Notifications', method: 'get', url: '/admin/notifications' },
    { name: 'Global Notifications (maybe no /admin prefix?)', method: 'get', url: '/notifications' },
  ];

  for (const ep of endpointsToTest) {
    console.log(`\n--- Testing ${ep.name} ---`);
    console.log(`[${ep.method.toUpperCase()}] ${ep.url}`);
    try {
      const res = await api({ method: ep.method, url: ep.url });
      console.log('✅ SUCCESS');
      console.log('Status:', res.status);
      if (res.data.data) {
        if (Array.isArray(res.data.data)) {
          console.log(`Array of ${res.data.data.length} items.`);
        } else {
          console.log('Keys:', Object.keys(res.data.data));
        }
      } else {
        if (Array.isArray(res.data)) {
          console.log(`Array of ${res.data.length} items.`);
        } else {
          console.log('Keys:', Object.keys(res.data));
        }
      }
    } catch (err) {
      console.log('❌ FAILED:', err.response?.status);
      console.log('Error Message:', err.response?.data?.message || err.message);
    }
  }
}

testAPIs();
