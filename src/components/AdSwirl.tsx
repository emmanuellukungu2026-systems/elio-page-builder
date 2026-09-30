/**
 * Looping line-art ribbon, echoing the swirls on the reference ad posters.
 * Pure SVG — uses `currentColor` so callers tint it with any text color.
 */
export function AdSwirl({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <path
        d="M172 36C136 8 78 18 58 66c-22 52 8 104 56 104 34 0 56-26 48-56-7-26-36-38-60-26"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="round"
      />
    </svg>
  );
}
