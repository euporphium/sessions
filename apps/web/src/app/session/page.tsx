import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function SessionPage() {
  const { isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    redirect(`/api/auth/login?post_login_redirect_url=/session`);
  }

  return (
    <main className="grid min-h-dvh place-items-center">
      <form className="grid rounded bg-gray-800 p-8">
        <label htmlFor="sessionName">Session Name</label>
        <input id="sessionName" name="sessionName" type="text" />

        <label htmlFor="maxParticipants">Maximum Participants</label>
        <input id="maxParticipants" name="maxParticipants" type="number" />

        <button type="submit">Create a New Session</button>
      </form>
    </main>
  );
}
