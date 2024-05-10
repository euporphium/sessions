import http from 'http';
import { Server } from 'socket.io';
import { SessionsSocketServer } from '@sessions/web-types';
import { InMemorySessionStore } from './sessionStore';
import { getLogger } from './logger';

const logger = getLogger();
const sessionStore = new InMemorySessionStore(logger);

export function addSocketServer(server: http.Server) {
  logger.verbose('adding socket server');

  const serverOptions = { cors: { origin: 'http://localhost:3000' } };
  const io: SessionsSocketServer = new Server(server, serverOptions);

  registerSessionMiddleware(io);
  registerEvents(io);

  return io;
}

function registerSessionMiddleware(io: SessionsSocketServer) {
  logger.verbose('registering session middleware');

  io.use((socket, next) => {
    const sessionId = socket.handshake.auth.sessionId;

    if (sessionId) {
      logger.verbose(`checking for session: ${sessionId}`);
      const session = sessionStore.findSession(sessionId);

      if (session) {
        logger.verbose(`session found: ${session.id}`);
        socket.data.sessionId = session.id;
      } else {
        logger.verbose(`session not found: ${sessionId}`);
        socket.data.sessionId = sessionStore.createSession();
      }
    } else {
      logger.verbose('no session id provided');
      socket.data.sessionId = sessionStore.createSession();
    }

    socket.emit('session', { id: socket.data.sessionId });

    next();
  });
}

function registerEvents(io: SessionsSocketServer) {
  logger.verbose('registering events');

  io.on('connection', (socket) => {
    logger.verbose(`socket connected with session: ${socket.data.sessionId}`);

    sessionStore.updateSession(socket.data.sessionId, { connected: true });

    socket.join(socket.data.sessionId);

    io.emit('chat', { sender: 'Server', text: 'A user connected' });

    socket.on('chat', (message) => {
      logger.info(`${message.sender} sent chat: ${message.text}`);
      socket.broadcast.emit('chat', message);
    });

    socket.on('disconnect', async (reason) => {
      logger.verbose(`socket disconnected: ${reason}`);

      const matchingSockets = await io.in(socket.id).fetchSockets();
      const isDisconnected = matchingSockets.length === 0;
      if (isDisconnected) {
        sessionStore.updateSession(socket.data.sessionId, { connected: false });
      }

      io.emit('chat', {
        sender: 'Server',
        text: 'A user disconnected',
      });
    });
  });
}
