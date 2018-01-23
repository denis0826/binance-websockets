const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const path = require('path');
 
const app = express();
 
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


app.use(express.static(path.join(__dirname, 'public')));

 
wss.on('connection', function connection(ws, req) {
  console.log("connected..");

  const location = url.parse(req.url, true);
 
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
 
  // ws.send('something');
});
 
server.listen(process.env.PORT || 8080, function listening() {
  console.log('Listening on %d', server.address().port);
});