import type { Server } from 'socket.io';

export type SocketSession = {
  id: string;
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
  noArg: () => void;
  arg: (data: string) => void;
  chat: (message: ChatMessage) => void;
};

export type InterServerEvents = {
  ping: () => void;
};

export type SocketData = {
  id: string;
  session: SocketSession;
};

export type SessionsSocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
