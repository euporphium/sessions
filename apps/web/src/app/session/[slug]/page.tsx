import { getAuthenticatedUser, getSessionBySlug } from '../actions';
import { notFound, redirect } from 'next/navigation';
import { SocketContextProvider } from '../../../components/socketContext';
import HostSession from '../../../components/hostSession';
import ParticipantSession from '../../../components/participantSession';
import { env } from '../../../env';

type SessionPageProps = {
  params: { slug: string };
};

export default async function SessionPage({ params }: SessionPageProps) {
  const user = await getAuthenticatedUser();
  if (!user) {
    const successUrl = new URL(env.server.KINDE_POST_LOGIN_REDIRECT_URL);
    const nextUrl = `${env.server.BASE_URL}/session/${params.slug}`;
    successUrl.searchParams.set('next', nextUrl);
    redirect(
      `/api/auth/login?post_login_redirect_url=${successUrl.toString()}`,
    );
  }

  const session = await getSessionBySlug(params.slug);
  if (!session || session.endedAt) {
    notFound();
  }

  const isHost = session.hostId === user.id;

  return (
    <SocketContextProvider userId={user.id} autoConnect>
      Welcome to {session.name}
      {isHost ? (
        <HostSession
          user={{ id: user.id, name: user.firstName }}
          session={session}
        />
      ) : (
        <ParticipantSession
          user={{ id: user.id, name: user.firstName }}
          session={session}
        />
      )}
    </SocketContextProvider>
  );
}
