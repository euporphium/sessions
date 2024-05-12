import { cn } from '../cn';
import {
  RelativePositionContextProvider,
  useRelativePositionContext,
} from './relativePositionContext';

type RelativePositionContainerProps = {
  className?: string;
  children?: React.ReactNode;
};

function ReferenceContainer_Inner({
  className,
  children,
}: RelativePositionContainerProps) {
  const { containerRef, containerProps } = useRelativePositionContext();

  return (
    <div ref={containerRef} className={cn(className)} {...containerProps}>
      {children}
    </div>
  );
}

export default function ReferenceContainer({
  children,
  ...rest
}: RelativePositionContainerProps) {
  return (
    <RelativePositionContextProvider>
      <ReferenceContainer_Inner {...rest}>{children}</ReferenceContainer_Inner>
    </RelativePositionContextProvider>
  );
}
