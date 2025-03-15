export default function Span({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`block max-w-80 overflow-hidden text-ellipsis ${
        className ?? ""
      }`}
    >
      {children}
    </span>
  );
}
