// sender.js
const http = require('http');
const config = require('./config');

async function sendData(data) {
  const options = {
    hostname: config.host,
    port: config.port,
    path: config.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(data))
    }
  };

  const req = http.request(options, (res) => {
    res.on('data', (chunk) => {
      // Xử lý phản hồi nếu cần
    });
  });

  req.on('error', (error) => {
    console.error('Lỗi khi gửi dữ liệu:', error.message);
  });

  req.write(JSON.stringify(data));
  req.end();
}

module.exports = { sendData };
