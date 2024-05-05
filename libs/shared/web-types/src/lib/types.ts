export type ClientToServerEvents = {
  hello: () => void;
  chat: (message: ChatMessage) => void;
};

type ChatMessage = {
  sender: string;
  text: string;
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
  name: string;
  age: number;
};
