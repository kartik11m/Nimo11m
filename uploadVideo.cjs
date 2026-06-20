const fs = require('fs');
const path = require('path');
const http = require('http');

// Read the video file
const videoPath = path.join(__dirname, 'public/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.20 PM.mp4');
const videoBuffer = fs.readFileSync(videoPath);
const base64Data = 'data:video/mp4;base64,' + videoBuffer.toString('base64');

console.log('📹 Video file loaded:', (videoBuffer.length / (1024*1024)).toFixed(2), 'MB');

// Replace with the actual token from the frontend
const token = process.argv[2] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lcklkIjoiNjdhYjg1ZjAyMTcyMDAwMDAwMDAwMDAxIiwib3duZXJFbWFpbCI6Im93bmVyQHJvYm9sZWFybi5jb20iLCJpYXQiOjE3MTk5Mzk2ODAsImV4cCI6MTcyMDU0NDQ4MH0.W5e0qlXdB7X_L_q-gXvuOZ1qj5pqjLPtYu0QDr5nGKo';

const payload = {
  title: 'Field Test 2026-06-05',
  tag: 'Field Recording',
  src: base64Data,
  chapter: 'ch1',
  duration: '0:35',
  color: '#FF6B35',
  rgb: '255,107,53'
};

const jsonPayload = JSON.stringify(payload);
console.log('📊 Payload size:', (jsonPayload.length / (1024*1024)).toFixed(2), 'MB');

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
      if (res.statusCode === 201 || res.statusCode === 200) {
        console.log('✅ Video uploaded successfully!');
        console.log('Response:', response);
      } else {
        console.log('❌ Upload failed:', response);
      }
    } catch (e) {
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

console.log('🚀 Sending request to http://localhost:5000/api/videos...');
req.write(jsonPayload);
req.end();
