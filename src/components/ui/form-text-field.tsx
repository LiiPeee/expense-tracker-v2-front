import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

type FormTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: string;
  step?: string;
  min?: string;
  /** Extra side effect to run on blur (e.g. CEP lookup) — runs after RHF's own onBlur. */
  onBlur?: () => void;
};

export function FormTextField<T extends FieldValues>({ control, name, label, placeholder, type, step, min, onBlur }: FormTextFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              step={step}
              min={min}
              placeholder={placeholder}
              {...field}
              onBlur={
                onBlur
                  ? () => {
                      field.onBlur();
                      onBlur();
                    }
                  : field.onBlur
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
