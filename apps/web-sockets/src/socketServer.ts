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
    const { connectionId, sessionCode } = socket.handshake.auth;

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

    socket.data.sessionCode = sessionCode;

    socket.emit('session', { id: socket.data.connectionId });

    next();
  });
}

function registerEvents(io: SessionsSocketServer) {
  // const serverUser = { id: 'SERVER', name: 'Server' };

  logger.verbose('registering events');

  io.on('connection', (socket) => {
    logger.verbose(`connected to: ${socket.data.connectionId}`);

    connectionStore.updateConnection(socket.data.connectionId, {
      connected: true,
    });

    socket.join(socket.data.connectionId);
    socket.join(socket.data.sessionCode);

    // io.to(socket.data.sessionCode).emit('chat', {
    //   sender: serverUser,
    //   text: 'A user connected',
    // });

    socket.on('chat', (message) => {
      logger.info(`${message.sender.name} sent chat: ${message.text}`);
      socket.broadcast.emit('chat', message);
    });

    socket.on('disconnect', async (reason) => {
      logger.verbose(`socket disconnected: ${reason}`);

      const matchingSockets = await io.in(socket.id).fetchSockets();
      const isDisconnected = matchingSockets.length === 0;
      if (isDisconnected) {
        connectionStore.updateConnection(socket.data.connectionId, {
          connected: false,
        });
      }

      // io.emit('chat', { sender: serverUser, text: 'A user disconnected' });
    });
  });
}
