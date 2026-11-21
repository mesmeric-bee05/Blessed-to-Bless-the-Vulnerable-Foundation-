type IconProps = {
  className?: string;
  strokeWidth?: number;
};

const base = {
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function ArrowUpRight({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function ArrowRight({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronDown({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Menu({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

export function Close({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Check({ className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function Shield({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="M12 3l7 3v5.5c0 4.6-3 8-7 9.5-4-1.5-7-4.9-7-9.5V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function Heart({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="M12 20.5S3.5 15.4 3.5 9.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 2.4c0 6-8.5 11.1-8.5 11.1Z" />
    </svg>
  );
}

export function Spark({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

export function Lock({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={strokeWidth} {...base}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function ExternalLink({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="M14 4h6v6M20 4l-8.5 8.5" />
      <path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </svg>
  );
}
