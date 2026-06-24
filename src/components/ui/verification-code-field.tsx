import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

type VerificationCodeFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
};

/** RHF-bound 6-digit numeric code input (centered, monospaced) with inline validation. */
export function VerificationCodeField<T extends FieldValues>({ control, name, label }: VerificationCodeFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="tracking-widest text-center text-lg font-mono"
              onChange={(event) => field.onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
