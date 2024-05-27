'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { SessionsSocketClient } from '@sessions/web-types';
import { env } from '../env';

type SocketContextProviderProps = {
  children: React.ReactNode;
  userId?: string;
  autoConnect?: boolean;
};

type SocketContext = {
  socket: SessionsSocketClient;
  meta: {
    isConnected: boolean;
    transport: string;
  };
};

const SocketContext = createContext<SocketContext | null>(null);

export function SocketContextProvider({
  children,
  userId,
  autoConnect = false,
}: SocketContextProviderProps) {
  const { socket, isConnected, transport } = useSocket(userId, autoConnect);

  if (!socket) {
    return <div className="min-h-screen bg-red-800">Loading</div>;
  }

  return (
    <SocketContext.Provider
      value={{ socket, meta: { isConnected, transport } }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketClient() {
  const context = useContext(SocketContext);

  if (context === null) {
    throw new Error('useSocket must be used within a SocketContextProvider');
  }

  const { socket } = context;

  return {
    // TODO: undecided if we should expose the socket object
    socket: socket,
    meta: context.meta,
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
  };
}

function useSocket(userId?: string, autoConnect = false) {
  const [socket, setSocket] = useState<SessionsSocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState<string>('N/A');

  useEffect(() => {
    if (socket) {
      onConnect();
      return;
    }

    const newSocket = io(env.client.NEXT_PUBLIC_SOCKET_SERVER_URL, {
      autoConnect: autoConnect,
      auth: { userId },
    });

    setSocket(newSocket);

    function onConnect() {
      setIsConnected(true);

      newSocket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }

    function onConnectError(error: Error) {
      console.error('connect_error:', error.message);
    }

    newSocket.on('connect', onConnect);
    newSocket.on('disconnect', onDisconnect);
    newSocket.on('connect_error', onConnectError);

    return () => {
      newSocket.off('connect', onConnect);
      newSocket.off('disconnect', onDisconnect);
      newSocket.off('connect_error', onConnectError);
    };
  }, []);

  return { socket, isConnected, transport };
}
