'use client';

import Chat from './chat';
import { useSocketClient } from './socketContext';
import { useEffect, useState } from 'react';
import { addSessionParticipant, endSession } from '@sessions/web-actions';
import type {
  User,
  SessionWithUsers,
  AccessRequest,
} from '@sessions/web-types';

type HostSessionProps = {
  user: User;
  session: SessionWithUsers;
};

export default function AdminSession({ user, session }: HostSessionProps) {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const { socket } = useSocketClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit('joinRoom', session.slug);
    socket.emit('joinRoom', `${session.slug}:host`);

    function onAccessRequested(accessRequest: AccessRequest) {
      const { userId } = accessRequest;
      setAccessRequests((prev) =>
        prev.some((r) => r.userId === userId) ? prev : [...prev, accessRequest],
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
    setAccessRequests((prev) => prev.filter((r) => r.userId !== userId));
    socket.emit('grantAccess', { roomId: session.slug, userId });
  }

  function denyAccess(userId: string) {
    console.log('Denying access for', userId);
    setAccessRequests((prev) => prev.filter((r) => r.userId !== userId));
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
          {session.users.map(({ id, firstName, lastName }) => (
            <li key={id}>
              {firstName} {lastName}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Access Requests</h2>
        {accessRequests.length === 0 ? (
          <p>No access requests</p>
        ) : (
          <ul>
            {accessRequests.map(({ userId, userName }) => (
              <li key={userId}>
                <span>{userName}</span>
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
