const WebSocket = require('ws');

let wss; // Sẽ được gán trong app.js

function initWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('[WS] Browser connected');

    ws.on('close', () => {
      console.log('[WS] Browser disconnected');
    });
  });
}

function broadcastMetric(data) {
  if (!wss) return;
  const json = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

module.exports = { initWebSocket, broadcastMetric };
