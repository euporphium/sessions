import Link from 'next/link';

export default async function Index() {
  return (
    <main className="grid min-h-dvh place-items-center">
      <div className="flex flex-1 flex-col items-center">
        <h1 className="text-4xl font-medium">Welcome</h1>

        <Link className="mt-10 underline" href={{ pathname: '/session' }}>
          Create Session
        </Link>
      </div>
    </main>
  );
}
