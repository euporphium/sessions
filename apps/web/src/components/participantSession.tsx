'use client';

import Chat from './chat';
import { useSocketClient } from './socketContext';
import { useEffect, useState } from 'react';
import {
  type Session,
  type SessionWithParticipants,
  User,
} from '@sessions/web-types';

type ParticipantSessionProps = {
  user: User;
  session: SessionWithParticipants;
};

export default function ParticipantSession({
  user,
  session,
}: ParticipantSessionProps) {
  const alreadyParticipant = session.sessionParticipants.some(
    (p) => p.userId === user.id,
  );
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
    socket.emit('requestAccess', { roomId: session.slug, userId: user.id });
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
