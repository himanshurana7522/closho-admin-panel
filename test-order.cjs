const axios = require('axios');

async function simulateOrder() {
  const baseURL = 'https://api-closho.onrender.com';
  console.log('1. Starting Order Simulation...');

  try {
    // 1. Get a product from public or admin API
    const productsRes = await axios.get(`${baseURL}/admin/products`); // if public isn't known, admin might fail without token, wait, let's use Admin token to get product
    // Let's just login as admin to get a product
    const adminLogin = await axios.post(`${baseURL}/admin/auth/login`, {
      email: 'groot@test.com',
      password: 'Groot@123'
    });
    const adminToken = adminLogin.data.data.accessToken || adminLogin.data.data.token || adminLogin.data.token;
    
    const adminApi = axios.create({ baseURL, headers: { Authorization: `Bearer ${adminToken}` } });
    const pRes = await adminApi.get('/admin/products');
    const products = pRes.data.data || pRes.data.products || pRes.data;
    if (!products || products.length === 0) {
      console.log('No products found to order');
      return;
    }
    const product = products[0];
    const productId = product.id || product._id;
    console.log(`- Found product: ${product.name} (ID: ${productId})`);

    // 2. Register/Login as Customer
    const customerEmail = `buyer_${Date.now()}@example.com`;
    console.log(`2. Registering Customer (${customerEmail})...`);
    await axios.post(`${baseURL}/auth/register`, {
      name: 'Test Buyer',
      email: customerEmail,
      password: 'Password123!',
      phone: '9999999999'
    }).catch(e => { /* ignore if already exists or fails, try login */ });

    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: customerEmail,
      password: 'Password123!'
    });
    const customerToken = loginRes.data.data?.accessToken || loginRes.data.data?.token || loginRes.data.token;
    
    const customerApi = axios.create({ baseURL, headers: { Authorization: `Bearer ${customerToken}` } });
    console.log('- Customer logged in successfully.');

    // 3. Add to Cart
    console.log('3. Adding to cart...');
    await customerApi.post('/cart', {
      productId: productId,
      quantity: 1,
      variant: 'default' // depends on API, usually optional
    }).catch(e => {
       console.log('Add to cart may have failed or already added:', e.response?.data?.message || e.message);
    });

    // 4. Checkout
    console.log('4. Executing Checkout...');
    const checkoutRes = await customerApi.post('/orders/checkout', {
      shippingAddress: {
        street: '123 Test Lane',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      paymentMethod: 'cod'
    });
    
    console.log('✅ Order Placed Successfully!');
    console.log('Order Details:', checkoutRes.data.data || checkoutRes.data);
    console.log('\n--> Switch to your Admin Panel browser now to see the real-time notification!');

  } catch (error) {
    console.error('Simulation failed:', error.response?.data || error.message);
  }
}

simulateOrder();
