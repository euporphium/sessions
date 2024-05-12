import { useEffect, useRef, useState } from 'react';

export function useCursorsRelativePosition(
  containerRef: React.RefObject<HTMLDivElement>,
  cursor: { x: number; y: number },
) {
  const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const cxPercentage = (cursor.x / rect.width) * 100;
      const cyPercentage = (cursor.y / rect.height) * 100;
      setRelativePosition({ x: cxPercentage, y: cyPercentage });
    }
  }, [cursor.x, cursor.y, containerRef]);

  return relativePosition;
}

export function useRelativePositionContainer() {
  const ref = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [mouseOnElement, setMouseOnElement] = useState(false);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (ref.current !== null) {
      const rect = ref.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setCursor({ x: x, y: y });
    }
  };

  const containerProps = {
    ref,
    onMouseEnter: () => setMouseOnElement(true),
    onMouseLeave: () => setMouseOnElement(false),
    onMouseMove: handleMouseMove,
  };

  return { ref, cursor, mouseOnElement, containerProps };
}
