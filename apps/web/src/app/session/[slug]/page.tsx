import { notFound, redirect } from 'next/navigation';
import { SocketContextProvider } from '../../../components/socketContext';
import AdminSession from '../../../components/adminSession';
import ParticipantSession from '../../../components/participantSession';
import { env } from '../../../env';
import {
  getAuthenticatedUser,
  getSessionWithUsersBySlug,
} from '@sessions/web-actions';

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

  const session = await getSessionWithUsersBySlug(params.slug);
  if (!session || session.endedAt) {
    notFound();
  }

  const participant = session.users.find(({ id }) => id === user.id);
  const isAdmin = participant?.role === 'admin';

  return (
    <SocketContextProvider userId={user.id} autoConnect>
      Welcome to {session.name}
      {isAdmin ? (
        <AdminSession user={user} session={session} />
      ) : (
        <ParticipantSession user={user} session={session} />
      )}
    </SocketContextProvider>
  );
}
