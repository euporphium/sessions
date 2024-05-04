import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to web-sockets!' });
});

const server = http.createServer(app);
const port = process.env.PORT || 3333;
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
