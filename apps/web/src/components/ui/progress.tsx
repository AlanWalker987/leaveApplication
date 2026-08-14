'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

type ProgressContextValue = {
  value: number;
  percentage: number;
};

type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string;
};

const ProgressContext = React.createContext<ProgressContextValue | null>(null);

const Progress = React.forwardRef<React.ComponentRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, max, children, indicatorClassName, ...props }, ref) => {
    const numericValue = typeof value === 'number' ? value : 0;
    const numericMax = typeof max === 'number' && max > 0 ? max : 100;
    const percentage = Math.min(Math.max((numericValue / numericMax) * 100, 0), 100);

    return (
      <ProgressContext.Provider value={{ value: numericValue, percentage }}>
        <div className={cn('w-full', className)}>
          {children ? (
            <div className="mb-2 flex items-center justify-between text-sm text-foreground">
              {children}
            </div>
          ) : null}
          <ProgressPrimitive.Root
            ref={ref}
            value={numericValue}
            max={numericMax}
            className="relative h-2 w-full overflow-hidden rounded-full bg-secondary"
            {...props}
          >
            <ProgressPrimitive.Indicator
              className={cn('h-full w-full flex-1 bg-primary transition-all', indicatorClassName)}
              style={{ transform: `translateX(-${100 - percentage}%)` }}
            />
          </ProgressPrimitive.Root>
        </div>
      </ProgressContext.Provider>
    );
  },
);
Progress.displayName = ProgressPrimitive.Root.displayName;

const ProgressLabel = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('truncate whitespace-nowrap text-left font-medium', className)}
      {...props}
    />
  ),
);
ProgressLabel.displayName = 'ProgressLabel';

const ProgressValue = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(ProgressContext);
    const displayValue = children ?? `${Math.round(context?.percentage ?? 0)}`;

    return (
      <span
        ref={ref}
        className={cn(
          'shrink-0 whitespace-nowrap text-right tabular-nums text-muted-foreground',
          className,
        )}
        {...props}
      >
        {displayValue}
      </span>
    );
  },
);
ProgressValue.displayName = 'ProgressValue';

export { Progress, ProgressLabel, ProgressValue };
