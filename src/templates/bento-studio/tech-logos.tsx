import React from "react";

interface TechIconProps {
  className?: string;
}

// 1. React Icon
export function ReactLogo({ className = "w-4 h-4" }: TechIconProps) {
  return (
    <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="none" aria-hidden="true">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

// 2. TypeScript Icon
export function TypeScriptLogo({ className = "w-4 h-4" }: TechIconProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" aria-hidden="true">
      <rect width="128" height="128" rx="16" fill="#3178C6" />
      <path d="M68.5 73.5H80V105H89V73.5H100.5V65H68.5V73.5ZM60 65H30V73.5H40.5V105H49.5V73.5H60V65Z" fill="white" />
    </svg>
  );
}

// 3. JavaScript Icon
export function JavaScriptLogo({ className = "w-4 h-4" }: TechIconProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" aria-hidden="true">
      <rect width="128" height="128" rx="16" fill="#F7DF1E" />
      <path d="M72 101.5C73.5 104 77 106 82 106C88 106 91.5 103 91.5 98.5V70H101V98C101 108 94 114 83 114C74.5 114 69.5 109.5 67 104.5L72 101.5ZM37.5 102C40 105 44.5 107.5 50.5 107.5C57.5 107.5 61.5 104 61.5 98.5C61.5 93.5 58 91 52.5 88.5L48.5 87C39.5 83 33 78 33 69C33 59.5 40.5 53 51 53C58 53 63.5 55.5 67.5 60.5L61 65C58.5 62 55.5 60.5 51 60.5C45.5 60.5 42 63.5 42 68C42 72.5 45 74.5 50.5 77L54.5 78.5C64.5 83 71 87.5 71 97.5C71 108 62.5 115 50.5 115C41 115 34.5 110.5 31 105.5L37.5 102Z" fill="#1C1B1A" />
    </svg>
  );
}

// 4. Next.js Icon
export function NextjsLogo({ className = "w-4 h-4" }: TechIconProps) {
  return (
    <svg className={className} viewBox="0 0 180 180" fill="none" aria-hidden="true">
      <circle cx="90" cy="90" r="90" fill="#000000" />
      <path d="M149.508 157.067L69.8454 54.0003H54V125.977H66.2778V69.5492L137.283 161.429C141.603 160.222 145.698 158.749 149.508 157.067Z" fill="url(#paint0_linear)" />
      <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear)" />
      <defs>
        <linearGradient id="paint0_linear" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 5. Node.js Icon
export function NodejsLogo({ className = "w-4 h-4" }: TechIconProps) {
  return (
    <svg className={className} viewBox="0 0 256 289" fill="none" aria-hidden="true">
      <path d="M128 0L256 74V222L128 289L0 222V74L128 0Z" fill="#539E43" />
      <path d="M128 26L232 86V206L128 261L24 206V86L128 26Z" fill="#333333" />
      <path d="M128 66L188 101V171L128 206L68 171V101L128 66Z" fill="#539E43" />
    </svg>
  );
}

// 6. Tailwind CSS Icon
export function TailwindLogo({ className = "w-4 h-4" }: TechIconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M14 13.5C16.5 8.5 21.5 6 29 6C38 6 41 12 43.5 15.5C41 17 38.5 17 36 17C29 17 26 12 18.5 12C15.5 12 14.5 13.5 14 13.5ZM4.5 27C7 22 12 19.5 19.5 19.5C28.5 19.5 31.5 25.5 34 29C31.5 30.5 29 30.5 26.5 30.5C19.5 30.5 16.5 25.5 9 25.5C6 25.5 5 27 4.5 27Z" fill="#38BDF8" />
    </svg>
  );
}

// 7. Python Icon
export function PythonLogo({ className = "w-4 h-4" }: TechIconProps) {
  return (
    <svg className={className} viewBox="0 0 110 110" fill="none" aria-hidden="true">
      <path d="M54.5 3C29 3 30.5 14 30.5 14L30.6 25.5H55V29H18.5C7.5 29 0 35.5 0 54.5C0 73.5 6.5 77 15 77H23.5V64.5C23.5 52.5 33 43.5 45 43.5H68.5C78 43.5 86 36.5 86 26V13C86 2.5 77.5 3 54.5 3ZM42 10.5C45.3 10.5 48 13.2 48 16.5C48 19.8 45.3 22.5 42 22.5C38.7 22.5 36 19.8 36 16.5C36 13.2 38.7 10.5 42 10.5Z" fill="#3776AB" />
      <path d="M55.5 107C81 107 79.5 96 79.5 96L79.4 84.5H55V81H91.5C102.5 81 110 74.5 110 55.5C110 36.5 103.5 33 95 33H86.5V45.5C86.5 57.5 77 66.5 65 66.5H41.5C32 66.5 24 73.5 24 84V97C24 107.5 32.5 107 55.5 107ZM68 99.5C64.7 99.5 62 96.8 62 93.5C62 90.2 64.7 87.5 68 87.5C71.3 87.5 74 90.2 74 93.5C74 96.8 71.3 99.5 68 99.5Z" fill="#FFD43B" />
    </svg>
  );
}

// 8. PostgreSQL Icon
export function PostgresLogo({ className = "w-4 h-4" }: TechIconProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" aria-hidden="true">
      <path d="M64 4C30.9 4 4 30.9 4 64C4 97.1 30.9 124 64 124C97.1 124 124 97.1 124 64C124 30.9 97.1 4 64 4Z" fill="#336791" />
      <path d="M64 24C44 24 38 38 38 48C38 64 50 72 50 82C50 90 44 94 44 94H84C84 94 78 90 78 82C78 72 90 64 90 48C90 38 84 24 64 24Z" fill="white" />
    </svg>
  );
}

// 9. Docker Icon
export function DockerLogo({ className = "w-4 h-4" }: TechIconProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" aria-hidden="true">
      <path d="M124 61C122 60 115 59 110 63C108 57 103 52 97 51L95 53C98 62 95 72 87 77C72 86 52 87 36 79C28 75 22 68 18 61C12 61 7 64 5 70C2 78 7 90 19 97C34 105 73 108 97 93C116 81 124 67 124 61Z" fill="#2496ED" />
      <rect x="36" y="52" width="10" height="9" rx="1.5" fill="#2496ED" />
      <rect x="49" y="52" width="10" height="9" rx="1.5" fill="#2496ED" />
      <rect x="62" y="52" width="10" height="9" rx="1.5" fill="#2496ED" />
      <rect x="49" y="40" width="10" height="9" rx="1.5" fill="#2496ED" />
      <rect x="62" y="40" width="10" height="9" rx="1.5" fill="#2496ED" />
      <rect x="75" y="40" width="10" height="9" rx="1.5" fill="#2496ED" />
      <rect x="75" y="52" width="10" height="9" rx="1.5" fill="#2496ED" />
    </svg>
  );
}

// 10. Figma Icon
export function FigmaLogo({ className = "w-4 h-4" }: TechIconProps) {
  return (
    <svg className={className} viewBox="0 0 38 57" fill="none" aria-hidden="true">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
    </svg>
  );
}

// 11. Git Icon
export function GitLogo({ className = "w-4 h-4" }: TechIconProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" aria-hidden="true">
      <path d="M125 58L69.8 2.8C66.1-0.9 60.1-0.9 56.4 2.8L2.8 56.4C-0.9 60.1-0.9 66.1 2.8 69.8L58.4 125.4C62.1 129.1 68.1 129.1 71.8 125.4L125 72.2C128.9 68.3 128.9 61.9 125 58Z" fill="#F05032" />
      <path d="M77.4 62.6C77.4 57.5 73.8 53.2 68.9 52.2V37.7C70.9 36.7 72.3 34.6 72.3 32.2C72.3 28.9 69.6 26.2 66.3 26.2C63 26.2 60.3 28.9 60.3 32.2C60.3 34.6 61.7 36.7 63.7 37.7V52.2C58.8 53.2 55.2 57.5 55.2 62.6C55.2 65.6 56.6 68.3 58.8 70V87.3C56.8 88.3 55.4 90.4 55.4 92.8C55.4 96.1 58.1 98.8 61.4 98.8C64.7 98.8 67.4 96.1 67.4 92.8C67.4 90.4 66 88.3 64 87.3V69.9C65.5 68.8 66.8 67.4 67.6 65.7L82.2 80.3C81.8 81.1 81.6 82 81.6 83C81.6 86.3 84.3 89 87.6 89C90.9 89 93.6 86.3 93.6 83C93.6 79.7 90.9 77 87.6 77C85.5 77 83.7 78.1 82.7 79.8L68.7 65.8C73.4 65.6 77.4 62.6 77.4 62.6Z" fill="white" />
    </svg>
  );
}

// 12. GraphQL Icon
export function GraphQLLogo({ className = "w-4 h-4" }: TechIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M50 8L86.4 29V71L50 92L13.6 71V29L50 8Z" stroke="#E10098" strokeWidth="6" fill="none" />
      <circle cx="50" cy="8" r="8" fill="#E10098" />
      <circle cx="86.4" cy="29" r="8" fill="#E10098" />
      <circle cx="86.4" cy="71" r="8" fill="#E10098" />
      <circle cx="50" cy="92" r="8" fill="#E10098" />
      <circle cx="13.6" cy="71" r="8" fill="#E10098" />
      <circle cx="13.6" cy="29" r="8" fill="#E10098" />
      <path d="M50 8L86.4 71M86.4 29L50 92M86.4 71L13.6 71M50 92L13.6 29M13.6 71L50 8M13.6 29L86.4 29" stroke="#E10098" strokeWidth="4" />
    </svg>
  );
}

// Helper: resolves skill/tech name to its vector logo, or null if custom
export function getTechLogo(name: string, className = "w-4 h-4"): React.ReactNode | null {
  const normalized = name.trim().toLowerCase();

  if (normalized.includes("react")) return <ReactLogo className={className} />;
  if (normalized === "ts" || normalized.includes("typescript")) return <TypeScriptLogo className={className} />;
  if (normalized === "js" || normalized.includes("javascript")) return <JavaScriptLogo className={className} />;
  if (normalized.includes("next")) return <NextjsLogo className={className} />;
  if (normalized.includes("node")) return <NodejsLogo className={className} />;
  if (normalized.includes("tailwind")) return <TailwindLogo className={className} />;
  if (normalized.includes("python")) return <PythonLogo className={className} />;
  if (normalized.includes("postgres") || normalized.includes("sql")) return <PostgresLogo className={className} />;
  if (normalized.includes("docker") || normalized.includes("container")) return <DockerLogo className={className} />;
  if (normalized.includes("figma") || normalized.includes("ui/ux") || normalized.includes("design")) return <FigmaLogo className={className} />;
  if (normalized.includes("git")) return <GitLogo className={className} />;
  if (normalized.includes("graphql")) return <GraphQLLogo className={className} />;

  return null;
}
