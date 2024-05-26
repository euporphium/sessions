import Chat from './chat';

type ParticipantSessionProps = {
  user: {
    id: string;
    name: string;
  };
};

export default function ParticipantSession({ user }: ParticipantSessionProps) {
  return (
    <div>
      <div>Participant Session</div>
      <Chat user={user} />
    </div>
  );
}
