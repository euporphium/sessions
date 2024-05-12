'use client';

import Link from 'next/link';
import { CheckIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import RelativePositionContainer from './referenceContainer';
import outlineEffectIcons from './svg';

const FireIcon = outlineEffectIcons['fire'];

export function SvgEffectDemo() {
  return (
    <main className="grid min-h-dvh place-items-center bg-neutral-900">
      <RelativePositionContainer className="flex h-[26rem] w-[44rem] justify-between rounded-lg border border-neutral-600 bg-neutral-800 stroke-[0.1] p-8 hover:stroke-[0.2]">
        <LeftSide />
        <div className="flex w-3/5 flex-col place-items-center">
          <FireIcon
            startColor="#404040"
            gradientColor="#10b981"
            percentOffset={{ x: -24, y: 0 }}
            pathClassNames={['fill-neutral-950/50', 'fill-neutral-800/50']}
          />
        </div>
      </RelativePositionContainer>
      <Attribution />
    </main>
  );
}

function LeftSide() {
  return (
    <div className="flex w-2/5 flex-col justify-between">
      <div className="flex flex-col gap-5">
        <CircleStackIcon className="w-14 rounded-lg bg-neutral-950/70 stroke-emerald-500 p-2 shadow-inner" />
        <h1 className="text-2xl tracking-wide text-neutral-200">Database</h1>
        <p className="-mt-2 tracking-wide text-neutral-500">
          Every project is a full Postgres database, the world's most trusted
          relational database.
        </p>
      </div>
      <div className="flex flex-col tracking-wide text-neutral-200">
        <span className="flex flex-row gap-2">
          <CheckIcon className="w-5" />
          <p>100% portable</p>
        </span>
        <span className="flex flex-row gap-2">
          <CheckIcon className="w-5" />
          <p>Built-in Auth with RLS</p>
        </span>
        <span className="flex flex-row gap-2">
          <CheckIcon className="w-5" />
          <p>Easy to extend</p>
        </span>
      </div>
    </div>
  );
}

function Attribution() {
  return (
    <footer className="rounded-lg border border-neutral-600 p-4 text-neutral-500">
      <h2 className="mb-2">Source: </h2>
      <ul className="flex gap-4">
        <Link
          href="https://github.com/sixfwa/svg-gradient-hover"
          className="underline"
        >
          GitHub
        </Link>
        <Link
          href="https://www.youtube.com/watch?v=KKQQn_lDuVQ"
          className="underline"
        >
          YouTube
        </Link>
      </ul>
    </footer>
  );
}
