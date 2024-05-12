import { cn } from '../../cn';
import { withOutlineEffect } from '../outlineEffectHoc';
import useRoundRobin from '../useRoundRobin';
import type { SVGComponentProps } from '../types';

type CreateSvgIconProps = {
  d: string[];
};

export function createSVGIcon({ d }: CreateSvgIconProps) {
  function Svg({
    className,
    children,
    pathClassNames = [],
    ...rest
  }: SVGComponentProps) {
    const { next } = useRoundRobin(pathClassNames, 'fill-none');
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={cn('h-96 w-96 ', className)}
        {...rest}
      >
        <defs>{children}</defs>
        {d.map((path, i) => (
          <path
            key={i}
            strokeLinecap="round"
            strokeLinejoin="round"
            d={path}
            className={next()}
            stroke="url(#strokeGradient)"
          />
        ))}
      </svg>
    );
  }

  return withOutlineEffect(Svg);
}
