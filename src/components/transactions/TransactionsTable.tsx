import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TransactionResponse } from "@/helper/transaction";
import { formatBRL } from "@/helper/utils";
import { Pencil, Trash2 } from "lucide-react";

type TransactionsTableProps = {
  transactions: TransactionResponse[];
  onEdit: (transaction: TransactionResponse) => void;
  onDelete: (id: number) => void;
};

export function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[110px]">Data</TableHead>
          <TableHead className="w-[220px]">Descricao</TableHead>
          <TableHead className="w-[160px]">Categoria</TableHead>
          <TableHead className="w-[120px]">Tipo</TableHead>
          <TableHead className="w-[140px] text-right">Valor</TableHead>
          <TableHead className="w-[160px]">Nome</TableHead>
          <TableHead className="w-[220px]">Email</TableHead>
          <TableHead className="w-[160px]">Telefone</TableHead>
          <TableHead className="w-[90px]">Recorrencia</TableHead>
          <TableHead className="w-[120px]">Acoes</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="truncate">
              {transaction.competenceDate
                ? new Date(transaction.competenceDate).toLocaleDateString("pt-BR")
                : transaction.createdDate
                  ? new Date(transaction.createdDate).toLocaleDateString("pt-BR")
                  : "-"}
            </TableCell>
            <TableCell className="truncate">{transaction.description}</TableCell>
            <TableCell className="truncate">{transaction.category?.name ?? "-"}</TableCell>
            <TableCell className="truncate">
              {transaction.typeTransaction === 1 ? "Despesa" : transaction.typeTransaction === 2 ? "Receita" : "-"}
            </TableCell>
            <TableCell className={`text-right font-medium ${transaction.typeTransaction === 1 ? "text-destructive" : "text-success"}`}>
              {formatBRL(Number(transaction.amount) || 0)}
            </TableCell>
            <TableCell className="truncate">{transaction.contact?.name ?? "-"}</TableCell>
            <TableCell className="truncate">{transaction.contact?.email ?? "-"}</TableCell>
            <TableCell className="truncate">{transaction.contact?.phone ?? "-"}</TableCell>
            <TableCell className="truncate">{transaction.recurrence ?? "-"}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" aria-label="Editar transacao" onClick={() => onEdit(transaction)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Excluir transacao" onClick={() => onDelete(transaction.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
