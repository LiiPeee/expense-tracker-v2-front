import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/ui/form-text-field";
import { LoadingButton } from "@/components/ui/loading-button";
import { type StockForm, stockFormDefaults, stockFormSchema } from "@/helper/stock";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type StockFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StockForm) => Promise<void> | void;
};

export function StockFormDialog({ open, onOpenChange, onSubmit }: StockFormDialogProps) {
  const form = useForm<StockForm>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: stockFormDefaults,
  });
  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (open) form.reset(stockFormDefaults);
  }, [open, form]);

  const handleOpenChange = (next: boolean) => {
    if (isSubmitting) return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Ativo
        </Button>
      </DialogTrigger>

      <DialogContent className="border-glass bg-card/90 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Novo Ativo</DialogTitle>
          <DialogDescription>Preencha os campos para registrar um novo ativo na sua carteira.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormTextField control={form.control} name="ticker" label="Ticker" placeholder="Ex: PETR4" />
            <FormTextField control={form.control} name="title" label="Nome" placeholder="Ex: Petrobras" />
            <FormTextField control={form.control} name="price" label="Preço de Compra" type="number" step="0.01" placeholder="Ex: 41.12" />
            <FormTextField control={form.control} name="quantity" label="Quantidade" type="number" step="1" placeholder="Ex: 2" />
            <FormTextField control={form.control} name="description" label="Descrição" placeholder="Opcional" />

            <LoadingButton type="submit" className="w-full" isLoading={isSubmitting} loadingText="Salvando...">
              Criar
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
