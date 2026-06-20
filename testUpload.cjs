const http = require('http');

// Test with minimal data first
const payload = {
  title: 'Test Upload Simple',
  tag: 'Test',
  src: 'data:video/mp4;base64,AAAAGGZ0eXBpc29tAA==',  // Very small dummy data
  chapter: 'ch1',
  duration: '0:10',
  color: '#FF6B35',
  rgb: '255,107,53'
};

const jsonPayload = JSON.stringify(payload);
const token = process.argv[2];

console.log('📊 Payload size:', jsonPayload.length, 'bytes');
console.log('🚀 Sending minimal test request...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/videos',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(jsonPayload),
    'Authorization': `Bearer ${token}`,
  }
};

const req = http.request(options, (res) => {
  console.log('📡 Response status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Response:', JSON.stringify(response, null, 2));
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(jsonPayload);
req.end();
