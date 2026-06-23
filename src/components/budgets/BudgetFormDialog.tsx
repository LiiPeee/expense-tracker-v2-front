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

type BudgetFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BudgetLimitForm) => Promise<void> | void;
  categoryOptions: readonly string[];
};

export function BudgetFormDialog({ open, onOpenChange, onSubmit, categoryOptions }: BudgetFormDialogProps) {
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
          Novo Orçamento
        </Button>
      </DialogTrigger>

      <DialogContent className="border-glass bg-card/90 backdrop-blur-md sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Novo Orçamento</DialogTitle>
          <DialogDescription>Defina um limite por categoria para acompanhar o orçamento da conta atual.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
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
                    <FormLabel>Mês</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o mês" />
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

              <FormTextField control={form.control} name="year" label="Ano" type="number" min="2000" step="1" placeholder="Ex: 2026" />
            </div>

            <FormTextField control={form.control} name="limitAmount" label="Limite" type="number" min="0" step="0.01" placeholder="Ex: 1500.00" />

            <LoadingButton type="submit" className="w-full rounded-xl" isLoading={isSubmitting} loadingText="Salvando...">
              Criar
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
