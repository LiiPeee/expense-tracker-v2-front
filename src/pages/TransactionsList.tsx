import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CategoryList } from "@/helper/category";
import { monthNames } from "@/helper/utils";
import { useTransaction } from "@/hooks/transaction/use-create-transaction";
import { useGetAll } from "@/hooks/transaction/use-get-transactions";
import { Pencil, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const TransactionsList = () => {
  const { handleDelete, handleEdit } = useTransaction();

  const categories = CategoryList;

  const {
    transactions,

    expenseMonthTotal,
    incomeMonthTotal,
    enconomyMonthTotal,
    isRefreshing,

    year,
    month,
    setYear,
    setMonth,

    getAllTransaction,
    getByType,
    getAllExpenseAndIncome,
    getByCategoryAndType,

    currentPage: serverPage,
    totalPages: serverTotalPages,
    totalRecords: serverTotalRecords,
    pageSize: serverPageSize,
  } = useGetAll();

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const didFetchRef = useRef(false);

  const [activeQuery, setActiveQuery] = useState<
    { kind: "all" } | { kind: "type"; typeName: string } | { kind: "categoryType"; category: string; typeName: string }
  >({ kind: "all" });

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    setActiveQuery({ kind: "all" });
    void getAllTransaction(1);
  }, [getAllTransaction]);

  const goToPage = (page: number) => {
    if (activeQuery.kind === "all") {
      void getAllTransaction(page);
      return;
    }

    if (activeQuery.kind === "type") {
      void getByType(activeQuery.typeName, page);
      return;
    }

    void getByCategoryAndType(activeQuery.category, activeQuery.typeName, page);
  };

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
              <div className="text-2xl font-bold text-success">R$ {incomeMonthTotal}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
              <TrendingDown className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">R$ {expenseMonthTotal}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${enconomyMonthTotal >= 0 ? "text-success" : "text-destructive"}`}>
                R$ {enconomyMonthTotal}
              </div>
            </CardContent>
          </Card>
        </div>

        <RefreshAllButton
          isRefreshing={isRefreshing}
          onRefresh={async () => {
            try {
              await getAllExpenseAndIncome();

              setActiveQuery({ kind: "all" });
              await getAllTransaction(1);

              toast.success("Sucesso ao atualizar a pagina!");
            } catch (e) {
              toast.error("Error ao atualizar a pagina!");
            }
          }}
        />

        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mês</label>
                <Select value={month} onValueChange={(value) => setMonth(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas os meses</SelectItem>
                    {monthNames.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
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
                  onChange={(e) => setYear(e.target.value)}
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
                <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {Object.keys(CategoryList)
                      .filter((key) => isNaN(Number(key)))
                      .map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={filterType} onValueChange={(value) => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas os tipo</SelectItem>
                    <SelectItem value="INCOME">Receita</SelectItem>
                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          <Button
            variant="outline"
            className="w-full h-20 flex-col gap-2"
            onClick={() => {
              if (filterCategory === "all" && filterType === "all") {
                setActiveQuery({ kind: "all" });
                void getAllTransaction(1);
                return;
              }

              if (filterCategory === "all" && filterType !== "all") {
                setActiveQuery({ kind: "type", typeName: filterType });
                void getByType(filterType, 1);
                return;
              }

              if (filterCategory !== "all" && filterType !== "all") {
                setActiveQuery({ kind: "categoryType", category: filterCategory, typeName: filterType });
                void getByCategoryAndType(filterCategory, filterType, 1);
                return;
              }
            }}
          >
            <span>Consulta por Filtros</span>
          </Button>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Transações ({serverTotalRecords})</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Data</TableHead>
                  <TableHead className="w-[120px]">Nome</TableHead>
                  <TableHead className="w-[120px]">Descrição</TableHead>
                  <TableHead className="w-[120px]">Categoria</TableHead>
                  <TableHead className="w-[120px]">Tipo</TableHead>
                  <TableHead className="w-[120px]">Valor</TableHead>
                  <TableHead className="w-[120px]">Email</TableHead>
                  <TableHead className="w-[120px]">Name</TableHead>
                  <TableHead className="w-[120px]">Telefone</TableHead>
                  <TableHead className="w-[120px]">Recurrence</TableHead>
                  <TableHead className="w-[120px]">Edição/Deleção</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="truncate">
                      {transaction.dateOfInstallment
                        ? new Date(transaction.dateOfInstallment).toLocaleDateString("pt-BR")
                        : transaction.createdDate
                          ? new Date(transaction.createdDate).toLocaleDateString("pt-BR")
                          : "-"}
                    </TableCell>

                    <TableCell className="truncate">{transaction.name}</TableCell>
                    <TableCell className="truncate">{transaction.description}</TableCell>
                    <TableCell className="truncate">{transaction.category?.name ?? "-"}</TableCell>

                    <TableCell className="truncate">
                      {transaction.typeTransaction === 1 ? "Despesa" : transaction.typeTransaction === 2 ? "Receita" : "-"}
                    </TableCell>

                    <TableCell
                      className={`text-right font-medium ${transaction.typeTransaction === 1 ? "text-destructive" : "text-success"}`}
                    >
                      R$ {Number(transaction.amount).toFixed(2) ?? 0}
                    </TableCell>
                    <TableCell className="truncate">{transaction.contact?.email ?? "-"}</TableCell>
                    <TableCell className="truncate">{transaction.contact?.name ?? "-"}</TableCell>
                    <TableCell className="truncate">{transaction.contact?.phone ?? "-"}</TableCell>
                    <TableCell className="truncate">{transaction.recurrence ?? "-"}</TableCell>

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

            {(() => {
              const current = serverPage;
              const total = serverTotalPages;

              return (
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Página <span className="font-medium text-foreground">{current}</span> de{" "}
                    <span className="font-medium text-foreground">{total}</span>
                    <span className="ml-2">
                      (Total: <span className="font-medium text-foreground">{serverTotalRecords}</span>, pageSize:{" "}
                      <span className="font-medium text-foreground">{serverPageSize}</span>)
                    </span>
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          className={current === 1 ? "pointer-events-none opacity-50" : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(Math.max(1, current - 1));
                          }}
                        />
                      </PaginationItem>

                      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === current}
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          className={current === total ? "pointer-events-none opacity-50" : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(Math.min(total, current + 1));
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TransactionsList;
