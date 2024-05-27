export type SocketConnection = {
  userId: string;
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
