export type ClientToServerEvents = {
  hello: () => void;
};

export type ServerToClientEvents = {
  noArg: () => void;
  arg: (data: string) => void;
  foo: (data: string) => void;
};

export type InterServerEvents = {
  ping: () => void;
};

export type SocketData = {
  name: string;
  age: number;
};
