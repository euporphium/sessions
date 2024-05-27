'use client';

import Chat from './chat';
import { useSocketClient } from './socketContext';
import { useEffect, useState } from 'react';
import type { SessionWithUsers, User } from '@sessions/web-types';

type ParticipantSessionProps = {
  user: User;
  session: SessionWithUsers;
};

export default function ParticipantSession({
  user,
  session,
}: ParticipantSessionProps) {
  const alreadyParticipant = session.users.some(({ id }) => id === user.id);
  const [isParticipant, setIsParticipant] = useState(alreadyParticipant);
  const { socket } = useSocketClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    if (alreadyParticipant) {
      setIsParticipant(true);
      socket.emit('joinRoom', session.slug);
      return;
    }

    function onAccessGranted({ roomId }: { roomId: string }) {
      console.log('Access granted to room', roomId);
      socket.emit('joinRoom', roomId);
      setIsParticipant(true);
    }

    socket.on('accessGranted', onAccessGranted);

    return () => {
      socket.off('accessGranted', onAccessGranted);
    };
  }, [socket]);

  function requestAccess() {
    const fullName = `${user.firstName} ${user.lastName}`;
    socket.emit('requestAccess', {
      roomId: session.slug,
      userId: user.id,
      userName: fullName,
    });
  }

  return (
    <div>
      <div>Participant Session</div>
      {isParticipant ? (
        <Chat user={user} session={session} />
      ) : (
        <div>
          <button onClick={requestAccess} className="rounded bg-blue-400 p-2">
            Join
          </button>
        </div>
      )}
    </div>
  );
}
