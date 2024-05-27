import { ChatMessage, SocketConnection } from './types';

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
  session: (session: Pick<SocketConnection, 'userId'>) => void; // typed quickly - think about it
  chat: (message: ChatMessage) => void;
  endSession: () => void;

  accessRequested: ({ userId }: { userId: string }) => void;
  accessGranted: ({ roomId }: { roomId: string }) => void;
};

export type InterServerEvents = {
  ping: () => void;
};
