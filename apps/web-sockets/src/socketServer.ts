import http from 'http';
import { Server } from 'socket.io';
import { SessionsSocketServer } from '@sessions/web-types';
import { InMemoryConnectionStore } from './sessionStore';
import { getLogger } from './logger';
import env from '../env';

const logger = getLogger();
const connectionStore = new InMemoryConnectionStore(logger);

export function addSocketServer(server: http.Server) {
  logger.verbose('adding socket server');

  const origin = env.CORS_ORIGIN;

  const serverOptions = { cors: { origin } };
  const io: SessionsSocketServer = new Server(server, serverOptions);

  registerConnectionMiddleware(io);
  registerEvents(io);
}

function registerConnectionMiddleware(io: SessionsSocketServer) {
  logger.verbose('registering connection middleware');

  io.use((socket, next) => {
    const { connectionId, userId } = socket.handshake.auth;

    if (connectionId) {
      logger.verbose(`checking for connection: ${connectionId}`);
      const connection = connectionStore.findConnection(connectionId);

      if (connection) {
        logger.verbose(`connection found: ${connection.id}`);
        socket.data.connectionId = connection.id;
      } else {
        logger.verbose(`connection not found: ${connectionId}`);
        socket.data.connectionId = connectionStore.createConnection();
      }
    } else {
      logger.verbose('no connection id provided');
      socket.data.connectionId = connectionStore.createConnection();
    }

    socket.data.userId = userId;

    socket.emit('session', { id: socket.data.connectionId });

    next();
  });
}

function registerEvents(io: SessionsSocketServer) {
  logger.verbose('registering events');

  io.on('connection', (socket) => {
    logger.verbose(`connected to: ${socket.data.connectionId}`);

    connectionStore.updateConnection(socket.data.connectionId, {
      connected: true,
    });

    socket.join(socket.data.userId);

    socket.on('disconnect', async (reason) => {
      logger.verbose(`socket disconnected: ${reason}`);

      const matchingSockets = await io.in(socket.id).fetchSockets();
      const isDisconnected = matchingSockets.length === 0;
      if (isDisconnected) {
        connectionStore.updateConnection(socket.data.connectionId, {
          connected: false,
        });
      }
    });

    socket.on('joinRoom', (roomId) => {
      logger.info(`joining room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on('leaveRoom', (roomId) => {
      logger.info(`leaving room: ${roomId}`);
      socket.leave(roomId);
    });

    socket.on('requestAccess', ({ roomId, userId }) => {
      logger.info(`requesting access: ${roomId}`);
      socket.to(`${roomId}:host`).emit('accessRequested', { userId });
    });

    socket.on('grantAccess', ({ roomId, userId }) => {
      logger.info(`granting access: ${roomId}`);
      socket.to(userId).emit('accessGranted', { roomId });
    });

    socket.on('endSession', ({ slug }) => {
      logger.info(`ending session: ${slug}`);
      io.to(slug).emit('endSession');
    });

    socket.on('chat', (message) => {
      logger.info(
        `[${message.sessionCode}] ${message.sender.name} sent chat: ${message.text}`,
      );
      io.to(message.sessionCode).emit('chat', message);
    });
  });
}
