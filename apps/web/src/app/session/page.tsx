import { redirect } from 'next/navigation';
import {
  getKindeServerSession,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/server';
import { createSession, getAuthenticatedUser } from './actions';

export default async function SessionCreationPage() {
  const { isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    redirect(`/api/auth/login`);
  }

  const user = await getAuthenticatedUser();

  return (
    <main className="grid min-h-dvh place-items-center">
      <form
        action={createSession}
        className="grid min-w-80 rounded bg-gray-800 p-8"
      >
        <label htmlFor="name">Session Name</label>
        <input id="name" name="name" type="text" />

        <label htmlFor="maxParticipants">Maximum Participants</label>
        <input id="maxParticipants" name="maxParticipants" type="number" />

        <label htmlFor="slug">Slug</label>
        <input id="slug" name="slug" type="text" />

        <button type="submit" className="bg-blue-500 p-4">
          Create a New Session
        </button>
      </form>
      <div>
        <h2>Authenticated as {user?.firstName}</h2>
        <LogoutLink className="underline">Sign Out</LogoutLink>
      </div>
    </main>
  );
}
