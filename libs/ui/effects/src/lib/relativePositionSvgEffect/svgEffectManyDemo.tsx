'use client';

import RelativePositionContainer from './referenceContainer';
import outlineEffectIcons from './svg';

export function SvgEffectManyDemo() {
  const iconProps = {
    startColor: '#404040',
    gradientColor: '#10b981',
    className: 'h-24 w-24',
  };

  return (
    <main className="bg-neutral-900">
      <RelativePositionContainer className="grid min-h-dvh grid-cols-12 place-items-center">
        {Object.values(outlineEffectIcons).map((Component, i) => (
          <Component key={i} {...iconProps} />
        ))}
      </RelativePositionContainer>
    </main>
  );
}
