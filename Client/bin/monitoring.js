#!/usr/bin/env node
const express = require('express');
const http = require('http');
const metrics = require('../src/metric');
const sender = require('../src/sender');
const config = require('../src/config');

const app = express();  // Khởi tạo express app

console.log('[Monitor] Khởi động giám sát hệ thống...');
async function startMonitoring() {
  let compare = null;

  while (true) {
    try {
      console.log('[Monitor] Đang thu thập metrics...');
      const data = await metrics.getMetrics();
      console.log('Dữ liệu metrics:', data);

      const filteredData = stripNonEssential(data);

      if (!compare || JSON.stringify(filteredData) !== JSON.stringify(compare)) {
        await sender.sendData(data);  // Gửi bản gốc vẫn giữ timestamp
        console.log(`[Monitor] Đã gửi metric lúc ${new Date().toISOString()}`);
        compare = filteredData; // Lưu lại bản đã lược bỏ timestamp
      } else {
        console.log('[Monitor] Dữ liệu không thay đổi, không gửi.');
      }

    } catch (err) {
      console.error('[Monitor] Lỗi khi thu thập hoặc gửi dữ liệu:', err.message);
    }

    await new Promise(resolve => setTimeout(resolve, config.interval));
  }
}

function stripNonEssential(data) {
  const cloned = structuredClone(data);
  delete cloned.timestamp;
  return cloned;
}


startMonitoring();

// Đảm bảo rằng server Express chạy trên cổng 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
