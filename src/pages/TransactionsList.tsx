import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { categories, monthNames } from "@/helper/utils";
import { useTransaction } from "@/hooks/use-create-and-edit-transaction";
import { useGetAll } from "@/hooks/use-get-transactions";
import { Pencil, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TransactionsList = () => {
  const { handleDelete, handleEdit } = useTransaction();
  const {
    transactions,
    expenseMonthTotal,
    incomeMonthTotal,
    enconomyMonthTotal,
    isRefreshing,
    year,
    month,
    getAllTransaction,
    getAllExpenseAndIncome,
    getByCategory,
    getByMontAndYear,
    setMonth,
    setYear,
  } = useGetAll();

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Todas as Transações</h2>
          <p className="text-muted-foreground">Visualize e filtre suas transações</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
              <TrendingUp className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">R$ {incomeMonthTotal.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
              <TrendingDown className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">R$ {expenseMonthTotal.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${enconomyMonthTotal >= 0 ? "text-success" : "text-destructive"}`}>
                R$ {incomeMonthTotal.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
        <RefreshAllButton isRefreshing={isRefreshing} onRefresh={getAllExpenseAndIncome} />

        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mês</label>
                <Select
                  value={month}
                  onValueChange={(value) => {
                    setMonth(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas os meses</SelectItem>
                    {monthNames.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ano</label>
                <Input
                  id="year"
                  type="number"
                  step="0.01"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                  }}
                  placeholder="Ex: 1999"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={filterCategory}
                  onValueChange={(value) => {
                    setFilterCategory(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <Button
            variant="outline"
            className="w-full h-20 flex-col gap-2"
            onClick={() => {
              if (filterCategory != null) {
                void getByCategory(filterCategory);
              }
            }}
          >
            <span>Consulta por Filtros</span>
          </Button>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Transações ({transactions.length})</CardTitle>
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
                  <TableHead className="w-[90px]">Recurrence</TableHead>
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

export default TransactionsList;
