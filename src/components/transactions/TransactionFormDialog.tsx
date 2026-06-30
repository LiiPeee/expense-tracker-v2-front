import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormTextField } from "@/components/ui/form-text-field";
import { LoadingButton } from "@/components/ui/loading-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toCategoryKey } from "@/helper/category";
import type { Contact } from "@/helper/contact";
import { type TransactionForm, transactionFormSchema } from "@/helper/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type TransactionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrepareNew: () => void;
  onSubmit: (data: TransactionForm) => Promise<void> | void;
  contacts: Contact[];
  editingTransaction: boolean;
  defaultValues: TransactionForm;
  categoryOptions: readonly string[];
};

export function TransactionFormDialog({
  open,
  onOpenChange,
  onPrepareNew,
  onSubmit,
  contacts,
  editingTransaction,
  defaultValues,
  categoryOptions,
}: TransactionFormDialogProps) {
  const { t } = useTranslation("transactions");
  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues,
  });
  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, defaultValues, form]);

  const handleOpenChange = (next: boolean) => {
    if (isSubmitting) return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2" onClick={onPrepareNew}>
          <Plus className="w-4 h-4" />
          {t("newTransaction")}
        </Button>
      </DialogTrigger>

      <DialogContent className="border-glass bg-card/90 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>{editingTransaction ? t("editTransaction") : t("newTransaction")}</DialogTitle>
          <DialogDescription>
            {editingTransaction ? t("editDescription") : t("newDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormTextField control={form.control} name="transactionName" label={t("fieldName")} placeholder={t("fieldNamePlaceholder")} />
            <FormTextField control={form.control} name="description" label={t("fieldDescription")} placeholder={t("fieldDescriptionPlaceholder")} />

            <FormField
              control={form.control}
              name="paid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fieldPaid")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("select")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sim">{t("yes")}</SelectItem>
                      <SelectItem value="Não">{t("no")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fieldContact")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("select")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id ?? contact.name} value={contact.name ?? ""}>
                          {contact.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormTextField control={form.control} name="numberOfInstallment" label={t("fieldInstallments")} placeholder={t("fieldInstallmentsPlaceholder")} />
            <FormTextField control={form.control} name="dateOfInstallment" label={t("fieldInstallmentDate")} placeholder={t("fieldInstallmentDatePlaceholder")} />

            <FormField
              control={form.control}
              name="recurrence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fieldRecurrence")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectShort")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NONE">{t("recurrenceNone")}</SelectItem>
                      <SelectItem value="DAILY">{t("recurrenceDaily")}</SelectItem>
                      <SelectItem value="BIWEEKLY">{t("recurrenceBiweekly")}</SelectItem>
                      <SelectItem value="MONTHLY">{t("recurrenceMonthly")}</SelectItem>
                      <SelectItem value="OCCASIONALLY">{t("recurrenceOccasionally")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormTextField control={form.control} name="amount" label={t("fieldAmount")} type="number" step="0.01" placeholder={t("fieldAmountPlaceholder")} />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fieldType")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("select")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Income">{t("typeIncome")}</SelectItem>
                      <SelectItem value="Expense">{t("typeExpense")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fieldCategory")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("fieldCategoryPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {t(`categories.${toCategoryKey(category)}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormTextField control={form.control} name="subCategory" label={t("fieldSubCategory")} placeholder={t("fieldSubCategoryPlaceholder")} />

            <LoadingButton type="submit" className="w-full" isLoading={isSubmitting} loadingText={t("saving")}>
              {editingTransaction ? t("update") : t("create")}
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
