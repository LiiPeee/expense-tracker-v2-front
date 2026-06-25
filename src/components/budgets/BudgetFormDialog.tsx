import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormTextField } from "@/components/ui/form-text-field";
import { LoadingButton } from "@/components/ui/loading-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { budgetFormDefaults, budgetFormSchema, type BudgetLimitForm } from "@/helper/budget";
import { monthNames } from "@/helper/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type BudgetFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BudgetLimitForm) => Promise<void> | void;
  categoryOptions: readonly string[];
};

export function BudgetFormDialog({ open, onOpenChange, onSubmit, categoryOptions }: BudgetFormDialogProps) {
  const { t } = useTranslation("budgets");
  const form = useForm<BudgetLimitForm>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: budgetFormDefaults,
  });
  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (open) form.reset(budgetFormDefaults);
  }, [open, form]);

  const handleOpenChange = (next: boolean) => {
    if (isSubmitting) return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          {t("newBudget")}
        </Button>
      </DialogTrigger>

      <DialogContent className="border-glass bg-card/90 backdrop-blur-md sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{t("newBudget")}</DialogTitle>
          <DialogDescription>{t("formDescription")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("category")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCategory")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("month")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectMonth")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {monthNames.map((monthLabel, index) => (
                          <SelectItem key={monthLabel} value={String(index + 1)}>
                            {monthLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormTextField control={form.control} name="year" label={t("year")} type="number" min="2000" step="1" placeholder={t("yearPlaceholder")} />
            </div>

            <FormTextField control={form.control} name="limitAmount" label={t("limit")} type="number" min="0" step="0.01" placeholder={t("limitPlaceholder")} />

            <LoadingButton type="submit" className="w-full rounded-xl" isLoading={isSubmitting} loadingText={t("saving")}>
              {t("create")}
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
