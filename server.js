// server.js
const WebSocket = require('ws'); // import ws

const PORT = 9000; // server port
const wss = new WebSocket.Server({ port: PORT }); // create server

let nextClientId = 1; // incremental client id
const clients = new Map(); // map of id -> ws

console.log(`WebSocket server running on ws://localhost:${PORT}`);

// helper: broadcast to all connected clients
function broadcastAll(message) {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

// helper: broadcast to all except sender
function broadcastExcept(senderId, message) {
  for (const [id, client] of clients) {
    if (id !== senderId && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

wss.on('connection', ws => {
  const id = nextClientId++; // assign id
  clients.set(id, ws); // store connection
  console.log(`Client ${id} connected — total clients: ${wss.clients.size}`);

  // send welcome and client id
  ws.send(JSON.stringify({ type: 'welcome', id, total: wss.clients.size }));

  // example: on message, echo back and broadcast to others
  ws.on('message', message => {
    const text = message.toString();
    console.log(`Received from ${id}: ${text}`);

    // echo back to sender
    ws.send(JSON.stringify({ type: 'echo', from: id, text }));

    // broadcast to everyone (including sender)
    // broadcastAll(JSON.stringify({ type: 'broadcastAll', from: id, text }));

    // or broadcast to everyone except sender
    broadcastExcept(id, JSON.stringify({ type: 'broadcast', from: id, text }));
  });

  // cleanup on close
  ws.on('close', (code, reason) => {
    clients.delete(id);
    console.log(
      `Client ${id} disconnected (code=${code}) — total clients: ${wss.clients.size}`,
    );
    // optionally notify remaining clients
    broadcastAll(
      JSON.stringify({
        type: 'clientDisconnected',
        id,
        total: wss.clients.size,
      }),
    );
  });

  // optional error handler
  ws.on('error', err => {
    console.error(`Client ${id} error:`, err);
  });
});
