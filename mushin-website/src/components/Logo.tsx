type LogoProps = {
  className?: string;
};

// Recreation of the Mushin wordmark: serif "mushin" with an ensō circle replacing the dot of the i.
export function Logo({ className = "" }: LogoProps) {
  return (
    <span
      className={`relative inline-block font-logo font-medium leading-none tracking-tight text-teal ${className}`}
      aria-label="Mushin"
      role="img"
    >
      <span aria-hidden="true">mush</span>
      <span aria-hidden="true" className="relative">
        ı
        <svg
          viewBox="0 0 24 24"
          className="absolute left-1/2 top-[-0.04em] h-[0.38em] w-[0.38em] -translate-x-[40%]"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M14.5 3.2a8.6 8.6 0 1 1-8.9 3.1"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span aria-hidden="true">n</span>
    </span>
  );
}
