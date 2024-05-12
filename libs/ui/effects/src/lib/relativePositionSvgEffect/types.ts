export type SVGComponentProps = {
  className?: string;
  children?: React.ReactNode;
  pathClassNames?: string[];
} & React.SVGProps<SVGSVGElement>;
