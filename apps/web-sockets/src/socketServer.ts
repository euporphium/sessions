import http from 'http';
import { Server } from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '@sessions/web-types';

export function addSocketServer(server: http.Server) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('chat', {
      sender: 'Server',
      text: 'A user connected',
    });

    socket.on('chat', (message) => {
      console.log('chatting', message);
      socket.broadcast.emit('chat', message);
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected');

      io.emit('chat', {
        sender: 'Server',
        text: 'A user connected',
      });
    });
  });

  return io;
}
