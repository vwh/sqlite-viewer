import { memo, type ReactNode } from "react";

const Span = memo(function Span({
  children,
  className,
}: {
  children: ReactNode;
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
});

export default Span;
