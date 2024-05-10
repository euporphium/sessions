import ConnectionManager from '../../components/connectionManager';
import Chat from '../../components/chat';
import { SocketContextProvider } from '../../components/socketContext';

export default async function Index() {
  return (
    <div>
      <SocketContextProvider>
        <ConnectionManager />
        <Chat />
      </SocketContextProvider>
    </div>
  );
}
