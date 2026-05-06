import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Contact } from "@/helper/contact";
import { type PaidValue, type RecurrenceLabel, type TransactionForm, type TransactionResponse } from "@/helper/transaction";
import { Plus } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

type TransactionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrepareNew: () => void;
  onSubmit: (event: FormEvent) => Promise<void> | void;
  contacts: Contact[];
  formData: TransactionForm;
  setFormData: Dispatch<SetStateAction<TransactionForm>>;
  editingTransaction: TransactionResponse | null;
  categoryOptions: readonly string[];
};

export function TransactionFormDialog({
  open,
  onOpenChange,
  onPrepareNew,
  onSubmit,
  contacts,
  formData,
  setFormData,
  editingTransaction,
  categoryOptions,
}: TransactionFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2" onClick={onPrepareNew}>
          <Plus className="w-4 h-4" />
          Nova Transacao
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingTransaction ? "Editar Transacao" : "Nova Transacao"}</DialogTitle>
          <DialogDescription>
            {editingTransaction ? "Atualize os dados da transacao selecionada." : "Preencha os campos para criar uma nova transacao."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transactionName">Nome da Transacao</Label>
            <Input
              id="transactionName"
              value={formData.transactionName}
              onChange={(event) => setFormData({ ...formData, transactionName: event.target.value })}
              placeholder="Ex: Salario"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descricao</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              placeholder="Ex: Salario de Janeiro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paid">Pago</Label>
            <Select value={formData.paid} onValueChange={(value) => setFormData({ ...formData, paid: value as PaidValue })}>
              <SelectTrigger id="paid">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="N\u00E3o">N\u00E3o</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Nome do Contato</Label>
            <Select value={formData.contactName} onValueChange={(value) => setFormData({ ...formData, contactName: value })}>
              <SelectTrigger id="contactName">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id ?? contact.name} value={contact.name ?? ""}>
                    {contact.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfInstallment">Numero de Parcelas</Label>
            <Input
              id="numberOfInstallment"
              value={formData.numberOfInstallment}
              onChange={(event) => setFormData({ ...formData, numberOfInstallment: event.target.value })}
              placeholder="Ex: 05"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfInstallment">Data de Parcela</Label>
            <Input
              id="dateOfInstallment"
              value={formData.dateOfInstallment}
              onChange={(event) => setFormData({ ...formData, dateOfInstallment: event.target.value })}
              placeholder="Ex: 05 (dia 5 de cada mes)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurrence">Recorrencia</Label>
            <Select
              value={formData.recurrence}
              onValueChange={(value) => setFormData({ ...formData, recurrence: value as RecurrenceLabel })}
            >
              <SelectTrigger id="recurrence">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N\u00E3o">N\u00E3o</SelectItem>
                <SelectItem value="Semanal">Semanal</SelectItem>
                <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                <SelectItem value="Mensal">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(event) => setFormData({ ...formData, amount: event.target.value })}
              placeholder="Ex: 1000.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={formData.type} onValueChange={(value: "Income" | "Expense") => setFormData({ ...formData, type: value })}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Income">Receita</SelectItem>
                <SelectItem value="Expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger id="category">
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

          <div className="space-y-2">
            <Label htmlFor="subCategory">Sub Categoria</Label>
            <Input
              id="subCategory"
              value={formData.subCategory}
              onChange={(event) => setFormData({ ...formData, subCategory: event.target.value })}
              placeholder="Ex: Salario"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {editingTransaction ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
