'use client';

import { cn } from './cn';
import { CheckIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export function CardHoverSvgEffect() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [mouseOnCard, setMouseOnCard] = useState(false);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (cardRef.current !== null) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setCursor({ x: x, y: y });
    }
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-neutral-900">
      <div
        className="flex h-[26rem] w-[44rem] justify-between rounded-lg border border-neutral-600 bg-neutral-800 stroke-[0.1] p-8 hover:stroke-[0.2]"
        ref={cardRef}
        onMouseEnter={() => setMouseOnCard(true)}
        onMouseLeave={() => setMouseOnCard(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="flex w-2/5 flex-col justify-between">
          <div className="flex flex-col gap-5">
            <CircleStackIcon className="w-14 rounded-lg bg-neutral-950/70 stroke-emerald-500 p-2 shadow-inner" />
            <h1 className="text-2xl tracking-wide text-neutral-200">
              Database
            </h1>
            <p className="-mt-2 tracking-wide text-neutral-500">
              Every project is a full Postgres database, the world's most
              trusted relational database.
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
        <div className="flex w-3/5 flex-col place-items-center">
          <EffectSvg
            SvgComponent={FlameSvg}
            className=""
            cardRef={cardRef}
            cursor={cursor}
            mouseOnCard={mouseOnCard}
          />
        </div>
      </div>
      <Attribution />
    </main>
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

function TrophySvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // fill="none"
      viewBox="0 0 24 24"
      // strokeWidth={1.5}
      // stroke="currentColor"
      // className="h-6 w-6"
      className={cn('h-96 w-96 ', className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
      />
    </svg>
  );
}

function FlameSvg({
  className,
  gradientCenter,
  gradientActive,
}: {
  className?: string;
  gradientCenter: { cx: string; cy: string };
  gradientActive: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // fill="none"
      viewBox="0 0 24 24"
      // strokeWidth={1.5}
      // stroke="currentColor"
      // className="h-6 w-6"
      className={cn('h-96 w-96 ', className)}
    >
      <defs>
        <radialGradient
          id="strokeGradient"
          gradientUnits="userSpaceOnUse"
          r="35%"
          {...gradientCenter}
        >
          {gradientActive && <stop stopColor="#10b981" />}
          <stop offset="1" stopColor="#404040" />
        </radialGradient>
      </defs>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
        className="fill-neutral-950/50"
        stroke="url(#strokeGradient)"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
        className="fill-neutral-800/50"
        stroke="url(#strokeGradient)"
      />
    </svg>
  );
}

type EffectSvgProps = {
  SvgComponent: any;
  className: string;
  cursor: { x: number; y: number };
  cardRef: React.RefObject<HTMLDivElement>;
  mouseOnCard: boolean;
};

function EffectSvg({
  SvgComponent,
  className,
  cursor,
  cardRef,
  mouseOnCard,
}: EffectSvgProps) {
  const [gradientCenter, setGradientCenter] = useState({
    cx: '50%',
    cy: '50%',
  });

  useEffect(() => {
    if (cardRef.current && cursor.x !== null && cursor.y !== null) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const cxPercentage = (cursor.x / cardRect.width) * 100 - 24; // minus 24 here to increase fade when on left of card
      const cyPercentage = (cursor.y / cardRect.height) * 100;
      setGradientCenter({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor, cardRef]);

  return (
    <SvgComponent
      className={cn('transition-all duration-200', className)}
      gradientCenter={gradientCenter}
      gradientActive={mouseOnCard}
    />
  );
}
