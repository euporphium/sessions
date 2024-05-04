import http from 'http';
import express from 'express';
import { registerSocketServer } from './socketServer';

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to web-sockets!' });
});

const server = http.createServer(app);

registerSocketServer(server);

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
