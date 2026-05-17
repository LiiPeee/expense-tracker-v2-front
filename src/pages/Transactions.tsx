import { Header } from "@/components/layout/Header";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshAllButton } from "@/components/ui/RefreshAll";
import { useContact } from "@/hooks/contact/use-contact";
import { useTransaction } from "@/hooks/transaction/use-create-transaction";
import { useGetAll } from "@/hooks/transaction/use-get-transactions";
import { useEffect, useRef } from "react";

const CATEGORY_OPTIONS = [
  "Alimenta\u00E7\u00E3o",
  "Conforto",
  "Moradia",
  "Transporte",
  "Sa\u00FAde",
  "Educa\u00E7\u00E3o",
  "Lazer",
  "Bens Pessoais",
  "Investimento",
  "Renda Vari\u00E1vel",
  "Benef\u00EDcios",
  "Sal\u00E1rio",
  "Outros",
] as const;

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

          <TransactionFormDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onPrepareNew={() => {
              handleDialogClose();
              void getAllContact();
            }}
            onSubmit={handleSubmit}
            contacts={contacts}
            formData={formData}
            setFormData={setFormData}
            editingTransaction={editingTransaction}
            categoryOptions={CATEGORY_OPTIONS}
          />
        </div>

        <RefreshAllButton isRefreshing={isRefreshing} onRefresh={getAllTransaction} />

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Lista de Transacoes</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsTable transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Transactions;
