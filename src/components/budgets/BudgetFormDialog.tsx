import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BudgetLimitForm } from "@/helper/budget";
import { monthNames } from "@/helper/utils";
import { Plus } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

type BudgetFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrepareNew: () => void;
  onSubmit: (event: FormEvent) => Promise<void> | void;
  formData: BudgetLimitForm;
  setFormData: Dispatch<SetStateAction<BudgetLimitForm>>;
  categoryOptions: readonly string[];
  isSubmitting?: boolean;
};

export function BudgetFormDialog({
  open,
  onOpenChange,
  onPrepareNew,
  onSubmit,
  formData,
  setFormData,
  categoryOptions,
  isSubmitting = false,
}: BudgetFormDialogProps) {
  const handleOpenChange = (next: boolean) => {
    if (isSubmitting) return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl" onClick={onPrepareNew}>
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </Button>
      </DialogTrigger>

      <DialogContent className="border-glass bg-card/90 backdrop-blur-md sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Novo Orçamento</DialogTitle>
          <DialogDescription>Defina um limite por categoria para acompanhar o orçamento da conta atual.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget-category">Categoria</Label>
            <Select value={formData.categoryName} onValueChange={(value) => setFormData((current) => ({ ...current, categoryName: value }))}>
              <SelectTrigger id="budget-category">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budget-month">Mês</Label>
              <Select value={formData.month} onValueChange={(value) => setFormData((current) => ({ ...current, month: value }))}>
                <SelectTrigger id="budget-month">
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((monthLabel, index) => (
                    <SelectItem key={monthLabel} value={String(index + 1)}>
                      {monthLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-year">Ano</Label>
              <Input
                id="budget-year"
                type="number"
                min="2000"
                step="1"
                value={formData.year}
                onChange={(event) => setFormData((current) => ({ ...current, year: event.target.value }))}
                placeholder="Ex: 2026"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget-limit-amount">Limite</Label>
            <Input
              id="budget-limit-amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.limitAmount}
              onChange={(event) => setFormData((current) => ({ ...current, limitAmount: event.target.value }))}
              placeholder="Ex: 1500.00"
              required
            />
          </div>

          <LoadingButton type="submit" className="w-full rounded-xl" isLoading={isSubmitting} loadingText="Salvando...">
            Criar
          </LoadingButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
