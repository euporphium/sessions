'use client';

import Chat from './chat';
import { useSocketClient } from './socketContext';
import { useEffect, useState } from 'react';
import { addSessionParticipant, endSession } from '@sessions/web-actions';
import type { User, SessionWithParticipants } from '@sessions/web-types';

type HostSessionProps = {
  user: User;
  session: SessionWithParticipants;
};

export default function AdminSession({ user, session }: HostSessionProps) {
  const [accessRequests, setAccessRequests] = useState<string[]>([]);
  const { socket } = useSocketClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit('joinRoom', session.slug);
    socket.emit('joinRoom', `${session.slug}:host`);

    function onAccessRequested({ userId }: { userId: string }) {
      setAccessRequests((prev) =>
        prev.includes(userId) ? prev : [...prev, userId],
      );
    }

    socket.on('accessRequested', onAccessRequested);

    return () => {
      socket.off('accessRequested', onAccessRequested);
    };
  }, [socket]);

  async function approveAccess(userId: string) {
    console.log('Approving access for', userId);
    await addSessionParticipant(userId, session.id);
    setAccessRequests((prev) => prev.filter((id) => id !== userId));
    socket.emit('grantAccess', { roomId: session.slug, userId });
  }

  function denyAccess(userId: string) {
    console.log('Denying access for', userId);
    setAccessRequests((prev) => prev.filter((id) => id !== userId));
  }

  async function handleEndSession() {
    const [{ slug }] = await endSession(session.id);
    socket.emit('endSession', { slug });
  }

  return (
    <div>
      <div>Host Session</div>
      <div>
        <h2>Current Users</h2>
        <ul>
          {session.sessionParticipants.map((p) => (
            <li key={p.userId}>{p.userId}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Access Requests</h2>
        {accessRequests.length === 0 ? (
          <p>No access requests</p>
        ) : (
          <ul>
            {accessRequests.map((userId) => (
              <li key={userId}>
                <span>{userId}</span>
                <button
                  onClick={() => approveAccess(userId)}
                  className="rounded bg-green-400 p-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => denyAccess(userId)}
                  className="rounded bg-red-400 p-2"
                >
                  Deny
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={handleEndSession} className="rounded bg-red-400 p-2">
        End Session
      </button>
      <Chat user={user} session={session} />
    </div>
  );
}
