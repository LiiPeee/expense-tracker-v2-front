import { StockForm, mapStockFormToRequest } from "@/helper/stock";
import { getErrorMessage } from "@/lib/api";
import { createStock } from "@/services/stock";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useCreateStock() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
  }, []);

  const submitStock = useCallback(
    async (data: StockForm) => {
      try {
        await createStock(mapStockFormToRequest(data));
        toast.success("Ativo criado com sucesso!");
        setIsDialogOpen(false);
        await queryClient.invalidateQueries({ queryKey: ["stocks"] });
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Erro inesperado ao salvar ativo."));
      }
    },
    [queryClient],
  );

  return { isDialogOpen, onOpenChange, submitStock };
}
