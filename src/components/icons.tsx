export function ArrowIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 12h17M14 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M4 12h16" />
      <path
        d="M12 4v16"
        style={{
          transformOrigin: "center",
          transform: open ? "rotate(90deg) scaleY(0)" : "none",
          transition: "transform .5s cubic-bezier(.22,1,.36,1)",
        }}
      />
    </svg>
  );
}
