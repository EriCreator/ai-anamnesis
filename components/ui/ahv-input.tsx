'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const ahvInputVariants = cva('bg-muted text-md md:text-sm w-full');

export interface AHVInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof ahvInputVariants> {
  error?: boolean;
}

const AHVInput = React.forwardRef<HTMLInputElement, AHVInputProps>(
  ({ className, error, ...props }, ref) => {
    const [value, setValue] = React.useState('');

    // Format the AHV number with proper dot placement
    const formatAHVNumber = (input: string) => {
      // Remove all non-digits
      const digits = input.replace(/\D/g, '');

      // Apply formatting based on length
      let formatted = '';

      if (digits.length > 0) {
        // First group (3 digits)
        formatted = digits.substring(0, Math.min(3, digits.length));

        // Add dot immediately when first group is complete
        if (digits.length >= 3) {
          formatted += '.';
        }

        // Second group (4 digits)
        if (digits.length > 3) {
          formatted += digits.substring(3, Math.min(7, digits.length));

          // Add dot immediately when second group is complete
          if (digits.length >= 7) {
            formatted += '.';
          }
        }

        // Third group (4 digits)
        if (digits.length > 7) {
          formatted += digits.substring(7, Math.min(11, digits.length));

          // Add dot immediately when third group is complete
          if (digits.length >= 11) {
            formatted += '.';
          }
        }

        // Fourth group (2 digits)
        if (digits.length > 11) {
          formatted += digits.substring(11, Math.min(13, digits.length));
        }
      }

      return formatted;
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const formattedValue = formatAHVNumber(input);
      setValue(formattedValue);
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          value={value}
          onChange={handleChange}
          className={cn(
            ahvInputVariants(),
            error && 'border-red-500 focus-visible:ring-red-500',
            className,
          )}
          placeholder="756.XXXX.XXXX.XX"
          maxLength={16} // 13 digits + 3 dots
          {...props}
          name={props.name || 'ahvNumber'}
        />
      </div>
    );
  },
);
AHVInput.displayName = 'AHVInput';

export { AHVInput };
