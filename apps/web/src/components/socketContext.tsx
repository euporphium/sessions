'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import type {
  SessionsSocketClient,
  SocketConnection,
} from '@sessions/web-types';
import { env } from '../env';

type SocketContextProviderProps = {
  children: React.ReactNode;
  sessionCode?: string;
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
  sessionCode,
  autoConnect = false,
}: SocketContextProviderProps) {
  const { socket, isConnected, transport } = useSocket(
    sessionCode,
    autoConnect,
  );

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

function useSocket(sessionCode?: string, autoConnect = false) {
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
      auth: {
        connectionId: Cookies.get('connectionId'),
        sessionCode,
      },
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

    registerCustomListeners(newSocket);

    return () => {
      newSocket.off('connect', onConnect);
      newSocket.off('disconnect', onDisconnect);
      newSocket.off('connect_error', onConnectError);
    };
  }, []);

  return { socket, isConnected, transport };
}

function registerCustomListeners(socket: SessionsSocketClient) {
  // typed quickly - think about it
  function onSession(session: Pick<SocketConnection, 'id'>) {
    console.log(`received session id: ${session.id} - storing in cookies`);
    Cookies.set('sessionId', session.id);
  }

  socket.on('session', onSession);
}
