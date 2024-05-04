'use client';

import { useEffect, useState } from 'react';
import { socket } from './socket';

export default function SocketComp() {
  const [isConnected, setIsConnected] = useState(socket?.connected ?? false);
  const [fooEvents, setFooEvents] = useState<string[]>([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: string) {
      console.log('foo event:', value);
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl">Header 1</h1>
    </div>
  );
}
