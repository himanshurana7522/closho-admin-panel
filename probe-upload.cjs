const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function test() {
  try {
    const loginRes = await axios.post('https://api-closho.onrender.com/admin/auth/login', { email: 'groot@test.com', password: 'Groot@123' });
    const token = loginRes.data.data.accessToken;

    // Create a dummy text file to act as an image for the probe
    fs.writeFileSync('dummy.jpg', 'fake image data');

    const form = new FormData();
    form.append('images', fs.createReadStream('dummy.jpg'));

    console.log('Sending upload request...');
    const res = await axios.post('https://api-closho.onrender.com/admin/products/upload-images', form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders()
      }
    });

    console.log('Success:', JSON.stringify(res.data, null, 2));
  } catch(e) {
    console.error('Error:', e.response?.data || e.message);
  } finally {
    if (fs.existsSync('dummy.jpg')) fs.unlinkSync('dummy.jpg');
  }
}
test();
