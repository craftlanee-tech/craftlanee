type LogoProps = {
  className?: string;
};

export default function Logo({ className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 560 160"
      role="img"
      aria-label="CraftLanee"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <image
        href="/images/craftLanee.png"
        x="8"
        y="18"
        width="103"
        height="130"
        preserveAspectRatio="xMidYMid meet"
      />

      <text
        x="120"
        y="108"
        fill="currentColor"
        fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="82"
        fontWeight="800"
      >
        raftLanee
      </text>
    </svg>
  );
}
