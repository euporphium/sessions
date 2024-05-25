import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { z } from 'zod';

export default async function SessionPage() {
  const { isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    redirect(`/api/auth/login?post_login_redirect_url=/session`);
  }

  async function createSession(formData: FormData) {
    'use server';

    // Matches slugs with lowercase letters, numbers, and hyphens, starting and ending with alphanumeric characters, and no consecutive hyphens.
    const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

    const sessionSchema = z.object({
      sessionName: z.string().trim().min(1, { message: 'Required' }).max(100),
      // TODO: form lib should do coercion - remove when available
      maxParticipants: z.string().min(1).pipe(z.coerce.number()),
      slug: z.string().regex(slugRegex),
    });

    const rawFormData = {
      sessionName: formData.get('sessionName'),
      maxParticipants: formData.get('maxParticipants'),
      slug: formData.get('slug'),
    };

    const validatedFormData = sessionSchema.safeParse(rawFormData);
    if (!validatedFormData.success) {
      const err = { errors: validatedFormData.error.flatten().fieldErrors };
      console.error(err);
      return err;
    }

    console.log(
      'Creating a new session with the following data:',
      validatedFormData.data,
    );
  }

  return (
    <main className="grid min-h-dvh place-items-center">
      <form
        action={createSession}
        className="grid min-w-80 rounded bg-gray-800 p-8"
      >
        <label htmlFor="sessionName">Session Name</label>
        <input id="sessionName" name="sessionName" type="text" />

        <label htmlFor="maxParticipants">Maximum Participants</label>
        <input id="maxParticipants" name="maxParticipants" type="number" />

        <label htmlFor="slug">Slug</label>
        <input id="slug" name="slug" type="text" />

        <button type="submit" className="bg-blue-500 p-4">
          Create a New Session
        </button>
      </form>
    </main>
  );
}
