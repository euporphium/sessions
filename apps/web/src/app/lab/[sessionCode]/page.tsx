import ConnectionManager from '../../../components/connectionManager';
import Chat from '../../../components/chat';
import { SocketContextProvider } from '../../../components/socketContext';

type QueryParams = {
  sessionCode: string;
};

export default async function Index({ params }: { params: QueryParams }) {
  return (
    <div>
      <SocketContextProvider sessionCode={params.sessionCode}>
        <ConnectionManager />
        {/*<Chat />*/}
      </SocketContextProvider>
    </div>
  );
}
