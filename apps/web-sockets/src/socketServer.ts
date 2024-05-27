import http from 'http';
import { Server } from 'socket.io';
import { SessionsSocketServer } from '@sessions/web-types';
import { getLogger } from './logger';
import env from '../env';

const logger = getLogger();

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
    const { userId } = socket.handshake.auth;
    socket.data.userId = userId;
    next();
  });
}

function registerEvents(io: SessionsSocketServer) {
  logger.verbose('registering events');

  io.on('connection', (socket) => {
    logger.verbose(`connected as: ${socket.data.userId}`);

    socket.join(socket.data.userId);

    socket.on('disconnect', async (reason) => {
      logger.verbose(`socket disconnected: ${reason}`);

      const matchingSockets = await io.in(socket.id).fetchSockets();
      const isDisconnected = matchingSockets.length === 0;
      if (isDisconnected) {
        // user has left the building
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

    socket.on('requestAccess', (accessRequest) => {
      logger.info(`requesting access: ${accessRequest.roomId}`);
      socket
        .to(`${accessRequest.roomId}:host`)
        .emit('accessRequested', accessRequest);
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
      socket.to(message.sessionCode).emit('chat', message);
    });
  });
}
