'use client';

import { socket } from './socket';

export default function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <div className="flex gap-2">
      <button className="bg-blue-200 p-2" onClick={connect}>
        Connect
      </button>
      <button className="bg-blue-200 p-2" onClick={disconnect}>
        Disconnect
      </button>
    </div>
  );
}
