const express = require('express');
const router = express.Router();
const { broadcastMetric } = require('../websocket');

router.post('/', (req, res) => {
  const metric = req.body;
  console.log('[API] Nhận dữ liệu:', metric);

  // (Nếu có dùng MongoDB thì lưu ở đây)

  broadcastMetric(metric); // Gửi cho WebSocket client
  res.status(200).json({ message: 'Metric received' });
});

module.exports = router;
