import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { type ReactNode, useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

type PasswordFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  /** Rendered between the input and the validation message (e.g. a strength indicator). */
  children?: ReactNode;
};

/** RHF-bound password input with a self-contained show/hide toggle and inline validation message. */
export function PasswordField<T extends FieldValues>({ control, name, label, placeholder, children }: PasswordFieldProps<T>) {
  const { t } = useTranslation("auth");
  const [show, setShow] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input type={show ? "text" : "password"} placeholder={placeholder} className="pr-10" {...field} />
            </FormControl>
            <button
              type="button"
              onClick={() => setShow((current) => !current)}
              aria-label={show ? t("hidePassword") : t("showPassword")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {children}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
