import Chat from './chat';

type HostSessionProps = {
  user: {
    id: string;
    name: string;
  };
};

export default function HostSession({ user }: HostSessionProps) {
  return (
    <div>
      <div>Host Session</div>
      <Chat user={user} />
    </div>
  );
}
