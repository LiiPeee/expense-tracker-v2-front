import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaidValue, RecurrenceLabel } from "@/helper/transaction";
import { useContact } from "@/hooks/contact/use-contact";
import { useTransaction } from "@/hooks/transaction/use-create-transaction";
import { useGetAll } from "@/hooks/transaction/use-get-transactions";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

const Transactions = () => {
  const {
    handleDelete,
    handleDialogClose,
    handleEdit,
    handleSubmit,
    setIsDialogOpen,
    setFormData,
    editingTransaction,
    isDialogOpen,
    formData,
  } = useTransaction();
  const { transactions, isRefreshing, getAllTransaction } = useGetAll();
  const { contacts, getAllContact } = useContact();

  const didFetchRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    void getAllTransaction();
  }, [getAllTransaction]);

  return (
    <div className="min-h-screen bg-background">
      <Header user={null} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Transações</h2>
            <p className="text-muted-foreground">Gerencie suas transações financeiras</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2"
                onClick={() => {
                  handleDialogClose();
                  getAllContact();
                }}
              >
                <Plus className="w-4 h-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTransaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transactionName">Nome da Transação</Label>
                  <Input
                    id="transactionName"
                    value={formData.transactionName}
                    onChange={(e) => setFormData({ ...formData, transactionName: e.target.value })}
                    placeholder="Ex: Salário"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Salario de Janeiro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paid">Pago</Label>
                  <Select value={formData.paid} onValueChange={(value) => setFormData({ ...formData, paid: value as PaidValue })}>
                    <SelectTrigger id="paid">
                      <SelectValue placeholder="Selecione..."></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sim">Sim</SelectItem>
                      <SelectItem value="Não">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Nome do Contato</Label>
                  <Select value={formData.contactName} onValueChange={(value) => setFormData({ ...formData, contactName: value })}>
                    <SelectTrigger id="contato">
                      <SelectValue placeholder="Selecione..."></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all"></SelectItem>
                      {contacts.map((contacts) => (
                        <SelectItem key={contacts.id ?? contacts.name} value={contacts.name ?? ""}>
                          {contacts.name}
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
                    onChange={(e) => setFormData({ ...formData, numberOfInstallment: e.target.value })}
                    placeholder="Ex: 05"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfInstallment">Data de Parcela</Label>
                  <Input
                    id="dateOfInstallment"
                    value={formData.dateOfInstallment}
                    onChange={(e) => setFormData({ ...formData, dateOfInstallment: e.target.value })}
                    placeholder="Ex: 05 (para dia 5 de cada mês)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recurrence">Recorrência</Label>
                  <Select
                    value={formData.recurrence}
                    onValueChange={(value) => setFormData({ ...formData, recurrence: value as RecurrenceLabel })}
                  >
                    <SelectTrigger id="recurrence">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Não">Não</SelectItem>
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
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alimentação">Alimentação</SelectItem>
                      <SelectItem value="Conforto">Conforto</SelectItem>
                      <SelectItem value="Moradia">Moradia</SelectItem>
                      <SelectItem value="Transporte">Transporte</SelectItem>
                      <SelectItem value="Saúde">Saúde</SelectItem>
                      <SelectItem value="Educação">Educação</SelectItem>
                      <SelectItem value="Lazer">Lazer</SelectItem>
                      <SelectItem value="Bens Pessoais">Bens Pessoais</SelectItem>
                      <SelectItem value="Investimento">Investimento</SelectItem>
                      <SelectItem value="Renda Variável">Renda Variável</SelectItem>
                      <SelectItem value="Benefícios">Benefícios</SelectItem>
                      <SelectItem value="Salário">Salário</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subCategory">Sub Categoria</Label>
                  <Input
                    id="subCategory"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder="Ex: Salário"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingTransaction ? "Atualizar" : "Criar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <RefreshAllButton isRefreshing={isRefreshing} onRefresh={getAllTransaction} />

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Lista de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px]">Data</TableHead>
                  <TableHead className="w-[220px]">Descrição</TableHead>
                  <TableHead className="w-[160px]">Categoria</TableHead>
                  <TableHead className="w-[120px]">Tipo</TableHead>
                  <TableHead className="w-[140px] text-right">Valor</TableHead>
                  <TableHead className="w-[160px]">Nome</TableHead>
                  <TableHead className="w-[220px]">Email</TableHead>
                  <TableHead className="w-[160px]">Telefone</TableHead>
                  <TableHead className="w-[90px]">Recorrência</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="truncate">
                      {transaction.dateOfInstallment ? new Date(transaction.dateOfInstallment).toLocaleDateString("pt-BR") : "sem data"}
                    </TableCell>
                    <TableCell className="truncate">{transaction.description}</TableCell>
                    <TableCell className="truncate">{transaction.category.name}</TableCell>
                    <TableCell className="truncate">{transaction.typeTransaction === 1 ? "Despesa" : "Receita"}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${transaction.typeTransaction === 1 ? "text-destructive" : "text-success"}`}
                    >
                      R$ {Number(transaction.amount).toFixed(2) ?? 0}
                    </TableCell>
                    <TableCell className="truncate">{transaction.contact.email ?? ""}</TableCell>
                    <TableCell className="truncate">{transaction.contact.name}</TableCell>
                    <TableCell className="truncate">{transaction.contact.phone}</TableCell>
                    <TableCell className="truncate">{transaction.recurrence}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(transaction)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Transactions;
