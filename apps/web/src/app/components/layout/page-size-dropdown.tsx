'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type PageSizeDropdownProps = {
  value: number;
  options?: number[];
  disabled?: boolean;
  label?: string;
  onChange: (value: number) => void;
};

const DEFAULT_PAGE_SIZE_OPTIONS = [50, 100, 150, 200];

export function PageSizeDropdown({
  value,
  options = DEFAULT_PAGE_SIZE_OPTIONS,
  disabled = false,
  label = 'Page Size',
  onChange,
}: PageSizeDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[var(--app-text)]">{label}:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="h-9 min-w-[88px] justify-between text-sm"
          >
            <span>{value}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[88px]">
          <DropdownMenuRadioGroup
            value={String(value)}
            onValueChange={(nextValue) => {
              const parsed = Number(nextValue);
              if (Number.isFinite(parsed) && parsed > 0) {
                onChange(parsed);
              }
            }}
          >
            {options.map((option) => (
              <DropdownMenuRadioItem key={option} value={String(option)}>
                {option}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
