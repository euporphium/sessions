import ConnectionManager from '../components/connectionManager';
import Chat from '../components/chat';

export default async function Index() {
  return (
    <div>
      <ConnectionManager />
      <Chat />
    </div>
  );
}
