import type { Server } from 'socket.io';
import type { Socket } from 'socket.io-client';

export type SocketSession = {
  id: string;
  connected: boolean;
};

export type ChatMessage = {
  sender: string;
  text: string;
};

export type ClientToServerEvents = {
  hello: () => void;
  chat: (message: ChatMessage) => void;
};

export type ServerToClientEvents = {
  session: (session: Pick<SocketSession, 'id'>) => void; // typed quickly - think about it
  chat: (message: ChatMessage) => void;
};

export type InterServerEvents = {
  ping: () => void;
};

export type SocketData = {
  sessionId: string;
  session: SocketSession;
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
