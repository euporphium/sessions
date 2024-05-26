import { getAuthenticatedUser, getSessionBySlug } from '../actions';
import { notFound, redirect } from 'next/navigation';

type SessionPageProps = {
  params: { slug: string };
};

export default async function SessionPage({ params }: SessionPageProps) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/api/auth/login');
  }

  const session = await getSessionBySlug(params.slug);
  if (!session) {
    notFound();
  }

  return <div>Welcome to {session.name}</div>;
}
