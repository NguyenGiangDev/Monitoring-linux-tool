#!/usr/bin/env node
const express = require('express');
const http = require('http');
const metrics = require('../src/metric');
const sender = require('../src/sender');
const config = require('../src/config');

const app = express();  // Khởi tạo express app

console.log('[Monitor] Khởi động giám sát hệ thống...');

async function startMonitoring() {
  while (true) {
    try {
      console.log('[Monitor] Đang thu thập metrics...');
      const data = await metrics.getMetrics();
      console.log('Dữ liệu metrics:', data);  // Kiểm tra dữ liệu thu thập
      await sender.sendData(data);
      console.log(`[Monitor] Đã gửi metric lúc ${new Date().toISOString()}`);
    } catch (err) {
      console.error('[Monitor] Lỗi khi thu thập hoặc gửi dữ liệu:', err.message);
    }

    // Đợi một khoảng thời gian trước khi gửi lần tiếp theo
    await new Promise(resolve => setTimeout(resolve, config.interval));
  }
}

startMonitoring();

// Đảm bảo rằng server Express chạy trên cổng 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
