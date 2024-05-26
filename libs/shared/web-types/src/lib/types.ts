import type { Server } from 'socket.io';
import type { Socket } from 'socket.io-client';

export type SocketConnection = {
  id: string;
  connected: boolean;
};

export type ChatMessage = {
  sender: {
    id: string;
    name: string;
  };
  text: string;
};

export type ClientToServerEvents = {
  hello: () => void;
  chat: (message: ChatMessage) => void;
};

export type ServerToClientEvents = {
  session: (session: Pick<SocketConnection, 'id'>) => void; // typed quickly - think about it
  chat: (message: ChatMessage) => void;
};

export type InterServerEvents = {
  ping: () => void;
};

export type SocketData = {
  connectionId: string;
  sessionCode?: string;
  session: SocketConnection;
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
