'use client';

import { useSocket } from './socketContext';

export default function ConnectionManager() {
  const { connect, disconnect, meta } = useSocket();
  const { isConnected, transport } = meta;

  return (
    <div className="flex gap-4 p-4">
      <button
        className="bg-blue-200 p-2"
        onClick={isConnected ? disconnect : connect}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </button>
      <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
      <div>Transport: {transport}</div>
    </div>
  );
}
