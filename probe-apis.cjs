const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('https://api-closho.onrender.com/admin/auth/login', { email: 'groot@test.com', password: 'Groot@123' });
    const token = loginRes.data.data.accessToken;
    const headers = { Authorization: `Bearer ${token}` };

    console.log("--- 1. Testing POST /admin/stores ---");
    try {
      const storePayload = {
        name: "Test Store",
        address: "123 Test St",
        city: "Test City",
        pincode: "123456",
        latitude: 28.6139,
        longitude: 77.2090,
        deliveryRadiusKm: 10,
        isOpen: true
      };
      const storeRes = await axios.post('https://api-closho.onrender.com/admin/stores', storePayload, { headers });
      console.log("Stores POST Success:", storeRes.status);
    } catch(e) { console.error("Stores POST Error:", e.response?.status, e.response?.data); }

    console.log("--- 2. Testing GET /admin/reels ---");
    try {
      const reelsRes = await axios.get('https://api-closho.onrender.com/admin/reels', { headers });
      console.log("Reels GET Success:", reelsRes.status);
    } catch(e) { console.error("Reels GET Error:", e.response?.status, e.response?.data); }

    console.log("--- 3. Testing POST /admin/coupons ---");
    try {
      const couponPayload = {
        code: "TEST100",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: 500,
        maxDiscount: 100,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 86400000).toISOString(),
        usageLimit: 100,
        isActive: true
      };
      const couponsRes = await axios.post('https://api-closho.onrender.com/admin/coupons', couponPayload, { headers });
      console.log("Coupons POST Success:", couponsRes.status);
    } catch(e) { console.error("Coupons POST Error:", e.response?.status, e.response?.data); }

  } catch(e) {
    console.error("Auth Error", e.message);
  }
}
test();
