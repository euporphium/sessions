import { ChatMessage } from './types'; // TODO: move
import type { AccessRequest } from './domain';

export type ClientToServerEvents = {
  hello: () => void;
  chat: (message: ChatMessage) => void;
  endSession: ({ slug }: { slug: string }) => void;

  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  requestAccess: (accessRequest: AccessRequest) => void;
  grantAccess: ({ roomId, userId }: { roomId: string; userId: string }) => void;
};

export type ServerToClientEvents = {
  chat: (message: ChatMessage) => void;
  endSession: () => void;

  accessRequested: (accessRequest: AccessRequest) => void;
  accessGranted: ({ roomId }: { roomId: string }) => void;
};

export type InterServerEvents = {
  ping: () => void;
};
