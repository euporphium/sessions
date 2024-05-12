type RadialGradientProps = {
  active: boolean;
  center: { cx: string; cy: string };
  radius: string;
  startColor: string;
  gradientColor: string;
};

export default function RadialGradient({
  active,
  center,
  radius,
  startColor,
  gradientColor,
}: RadialGradientProps) {
  return (
    <radialGradient
      id="strokeGradient"
      gradientUnits="userSpaceOnUse"
      r={radius}
      {...center}
    >
      {active && <stop stopColor={gradientColor} />}
      <stop offset="1" stopColor={startColor} />
    </radialGradient>
  );
}
