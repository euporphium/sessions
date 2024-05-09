import http from 'http';
import { Server } from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
  SessionsSocketServer,
} from '@sessions/web-types';
import { InMemorySessionStore } from './sessionStore';

export function addSocketServer(server: http.Server) {
  const serverOptions = { cors: { origin: 'http://localhost:3000' } };

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, serverOptions);

  registerSessionMiddleware(io);
  registerEvents(io);

  return io;
}

function registerSessionMiddleware(io: SessionsSocketServer) {
  const sessionStore = new InMemorySessionStore();

  sessionStore
    .findAllSessions()
    .forEach((session) => console.log('session', session.id));

  io.use((socket, next) => {
    const sessionId = socket.handshake.auth.sessionId;
    const session = sessionStore.findSession(sessionId);

    if (session) {
      socket.data.id = session ? session.id : sessionStore.createSession();
    } else {
      socket.data.id = sessionStore.createSession();
    }

    next();
  });
}

function registerEvents(io: SessionsSocketServer) {
  io.on('connection', (socket) => {
    console.log('socket connected:', socket.data);

    io.emit('chat', {
      sender: 'Server',
      text: 'A user connected',
    });

    socket.on('chat', (message) => {
      console.log('chatting', message);
      socket.broadcast.emit('chat', message);
    });

    socket.on('disconnect', (reason) => {
      console.log('socket disconnected:', reason);

      io.emit('chat', {
        sender: 'Server',
        text: 'A user connected',
      });
    });
  });
}
