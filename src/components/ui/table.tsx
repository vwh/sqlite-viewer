import * as React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 min-w-[150px] px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

// Function to convert hex blob string to data URL
const hexToDataUrl = (hex: string): string => {
  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16))
  );
  const blob = new Blob([bytes], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
};

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  dataType?: string;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, dataType, ...props }, ref) => {
    const isBlob = dataType?.toUpperCase() === "BLOB";
    const content = React.useMemo(() => {
      if (typeof children === "string" && children.length > 40) {
        return children.slice(0, 40) + "...";
      }
      return children;
    }, [children]);

    return (
      <td
        ref={ref}
        className={cn(
          "max-w-[200px] overflow-hidden truncate text-ellipsis whitespace-nowrap p-4 align-middle [&:has([role=checkbox])]:pr-0",
          className
        )}
        {...props}
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="cursor-pointer hover:underline">
              {isBlob ? (
                <span className="italic opacity-40">BLOB</span>
              ) : (
                content
              )}
            </span>
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align="start">
            <div className="flex flex-col justify-center gap-1">
              {isBlob && typeof children === "string" ? (
                <>
                  <img
                    src={hexToDataUrl(children)}
                    alt="BLOB content"
                    className="flex max-h-40 flex-col items-center justify-center gap-2 rounded object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    Blob length: {children.length}
                  </span>
                </>
              ) : (
                <span className="max-w-full break-words">{children}</span>
              )}
              {
                <Badge className="w-full self-start text-center text-xs font-semibold">
                  {dataType || "Unknown"}
                </Badge>
              }
            </div>
          </HoverCardContent>
        </HoverCard>
      </td>
    );
  }
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
};
