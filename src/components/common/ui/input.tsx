import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & {
   error?: string;
}>(
   ({ className, type, error, ...props }, ref) => {
      return (
         <div className="relative w-full">
            <input
               type={type}
               className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  error && "border-destructive",
                  className
               )}
               ref={ref}
               {...props}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
         </div>
      );
   }
);
Input.displayName = "Input";

export { Input };
