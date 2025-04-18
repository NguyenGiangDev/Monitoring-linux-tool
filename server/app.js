const express = require('express');
const http = require('http');
const path = require('path');
const { initWebSocket } = require('./websocket');
const metricsRouter = require('./routes/metrics');

const app = express();
const server = http.createServer(app);
console.log('[Monitor] Khởi động giám sát hệ thống...');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/metrics', metricsRouter);

initWebSocket(server);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

