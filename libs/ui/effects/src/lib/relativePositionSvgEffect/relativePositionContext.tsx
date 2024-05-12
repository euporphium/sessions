'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

type RelativePositionContextProviderProps = {
  children: React.ReactNode;
};

type RelativePositionContext = {
  containerProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseMove: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  };
  containerRef: React.RefObject<HTMLDivElement>;
  mouseOnElement: boolean;
  relativePosition: { x: number; y: number };
};

const RelativePositionContext = createContext<RelativePositionContext | null>(
  null,
);

export function RelativePositionContextProvider({
  children,
}: RelativePositionContextProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [mouseOnElement, setMouseOnElement] = useState(false);
  const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const cxPercentage = (cursor.x / rect.width) * 100;
      const cyPercentage = (cursor.y / rect.height) * 100;
      setRelativePosition({ x: cxPercentage, y: cyPercentage });
    }
  }, [cursor.x, cursor.y, containerRef]);

  function handleMouseMove(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    if (containerRef.current !== null) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setCursor({ x: x, y: y });
    }
  }

  const containerProps = {
    onMouseEnter: () => setMouseOnElement(true),
    onMouseLeave: () => setMouseOnElement(false),
    onMouseMove: handleMouseMove,
  };

  return (
    <RelativePositionContext.Provider
      value={{ containerRef, containerProps, mouseOnElement, relativePosition }}
    >
      {children}
    </RelativePositionContext.Provider>
  );
}

export function useRelativePositionContext() {
  const context = useContext(RelativePositionContext);

  if (context === null) {
    throw new Error(
      'useRelativePositionContext must be used within a RelativePositionContextProvider',
    );
  }

  return context;
}
