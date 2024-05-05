'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@sessions/web-types';

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3333';

type SocketContextProviderProps = {
  children: React.ReactNode;
};

type SocketContext = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  meta: {
    isConnected: boolean;
    transport: string;
  };
};

const SocketContext = createContext<SocketContext | null>(null);

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL!, {
  // TODO: (IF changed to true) -> ERROR: Text content does not match server-rendered HTML.
  // Fix: https://socket.io/how-to/use-with-nextjs#client
  autoConnect: false,
});

export function SocketContextProvider({
  children,
}: SocketContextProviderProps) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [transport, setTransport] = useState<string>('N/A');

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, meta: { isConnected, transport } }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (context === null) {
    throw new Error('useSocket must be used within a SocketContextProvider');
  }

  const { socket } = context;

  return {
    // TODO: undecided if we should expose the socket object
    socket: socket,
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
    meta: context.meta,
  };
}
