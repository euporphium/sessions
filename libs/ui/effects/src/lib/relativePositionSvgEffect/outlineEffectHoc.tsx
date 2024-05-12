import RadialGradient from './radialGradiant';
import { useRelativePositionContext } from './relativePositionContext';
import { cn } from '../cn';
import type { SVGComponentProps } from './types';

export type WithOutlineEffectProps = {
  startColor: string;
  gradientColor: string;
  className?: string;
  radius?: string;
  percentOffset?: { x: number; y: number };
} & SVGComponentProps;

export function withOutlineEffect(Component: React.FC<SVGComponentProps>) {
  return function WithOutlineEffect({
    className,
    radius = '50%',
    percentOffset = { x: 0, y: 0 },
    startColor,
    gradientColor,
    ...rest
  }: WithOutlineEffectProps) {
    const { mouseOnElement, relativePosition } = useRelativePositionContext();

    const cx = `${relativePosition.x + percentOffset.x}%`;
    const cy = `${relativePosition.y + percentOffset.y}%`;

    return (
      <Component
        className={cn('transition-all duration-200', className)}
        {...rest}
      >
        <RadialGradient
          active={mouseOnElement}
          center={{ cx, cy }}
          radius={radius}
          startColor={startColor}
          gradientColor={gradientColor}
        />
      </Component>
    );
  };
}
