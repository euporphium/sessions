import type { Server } from 'socket.io';
import type { Socket } from 'socket.io-client';

export type SocketConnection = {
  id: string;
  connected: boolean;
};

export type ChatMessage = {
  sessionCode: string;
  sender: {
    id: string;
    name: string;
  };
  text: string;
};

export type ClientToServerEvents = {
  hello: () => void;
  chat: (message: ChatMessage) => void;
  endSession: ({ slug }: { slug: string }) => void;

  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  requestAccess: ({
    roomId,
    userId,
  }: {
    roomId: string;
    userId: string;
  }) => void;
  grantAccess: ({ roomId, userId }: { roomId: string; userId: string }) => void;
};

export type ServerToClientEvents = {
  session: (session: Pick<SocketConnection, 'id'>) => void; // typed quickly - think about it
  chat: (message: ChatMessage) => void;
  endSession: () => void;

  accessRequested: ({ userId }: { userId: string }) => void;
  accessGranted: ({ roomId }: { roomId: string }) => void;
};

export type InterServerEvents = {
  ping: () => void;
};

export type SocketData = {
  connectionId: string;
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
