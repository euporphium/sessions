import svgData from './svgData';
import { createSVGIcon } from './createSVGIcon';
import { WithOutlineEffectProps } from '../outlineEffectHoc';

const outlineEffectIcons = svgData.reduce(
  (acc, svg) => {
    acc[svg.name] = createSVGIcon({ d: svg.pathData });
    return acc;
  },
  {} as Record<string, React.FC<WithOutlineEffectProps>>,
);

export default outlineEffectIcons;
