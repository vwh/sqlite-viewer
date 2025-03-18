import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import buttonVariants from "./buttonVariants";
import { memo, useCallback, useMemo } from "react";

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const ButtonComponent = ({
  className,
  variant,
  size,
  asChild = false,
  onClick,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(event);
      }
    },
    [onClick]
  );

  const computedClassName = useMemo(
    () => cn(buttonVariants({ variant, size, className })),
    [variant, size, className]
  );

  return (
    <Comp
      data-slot="button"
      className={computedClassName}
      onClick={handleClick}
      {...props}
    />
  );
};

export const Button = memo(ButtonComponent);
