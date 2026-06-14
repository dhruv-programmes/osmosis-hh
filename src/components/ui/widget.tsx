import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const widgetVariants = cva(
  "relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-card text-foreground shadow-lg",
  {
    variants: {
      size: {
        sm: "max-w-xs",
        md: "max-w-sm",
        lg: "max-w-md",
      },
      design: {
        default: "p-6",
        mumbai: "p-4",
      },
      variant: {
        default: "bg-background text-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      design: "default",
      variant: "default",
    },
  },
);

export interface WidgetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof widgetVariants> {
  asChild?: boolean;
}

const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  ({ className, size, design, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(widgetVariants({ size, design, variant }), className)}
      {...props}
    />
  ),
);
Widget.displayName = "Widget";

const WidgetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-none items-center justify-center", className)}
    {...props}
  />
));
WidgetHeader.displayName = "WidgetHeader";

const WidgetTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("leading-none font-semibold tracking-tight", className)}
    {...props}
  />
));
WidgetTitle.displayName = "WidgetTitle";

const WidgetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-stretch justify-start", className)}
    {...props}
  />
));
WidgetContent.displayName = "WidgetContent";

const WidgetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-none items-center justify-between", className)}
    {...props}
  />
));
WidgetFooter.displayName = "WidgetFooter";

export {
  Widget,
  WidgetHeader,
  WidgetTitle,
  WidgetContent,
  WidgetFooter,
  widgetVariants,
};
