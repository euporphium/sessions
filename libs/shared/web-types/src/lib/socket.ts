import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from './events';

export type SocketData = {
  userId: string;
};

export type SessionsSocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type SessionsSocketClient = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;
