import ConnectionManager from '../../../components/connectionManager';
import Chat from '../../../components/chat';
import { SocketContextProvider } from '../../../components/socketContext';

type QueryParams = {
  peerSessionId: string;
};

export default async function Index({ params }: { params: QueryParams }) {
  return (
    <div>
      <SocketContextProvider peerSessionId={params.peerSessionId}>
        <ConnectionManager />
        <Chat />
      </SocketContextProvider>
    </div>
  );
}
