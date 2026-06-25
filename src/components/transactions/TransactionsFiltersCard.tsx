import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryList } from "@/helper/category";
import type { Contact } from "@/helper/contact";
import { monthNames } from "@/helper/utils";
import { useTranslation } from "react-i18next";

type TransactionsFiltersCardProps = {
  month: string;
  year: string;
  filterCategory: string;
  filterType: string;
  filterContact: string;
  contacts: Contact[];
  onChangeMonth: (value: string) => void;
  onChangeYear: (value: string) => void;
  onChangeCategory: (value: string) => void;
  onChangeType: (value: string) => void;
  onChangeContact: (value: string) => void;
  onApplyFilters: () => void;
};

export function TransactionsFiltersCard({
  month,
  year,
  filterCategory,
  filterType,
  filterContact,
  contacts,
  onChangeMonth,
  onChangeYear,
  onChangeCategory,
  onChangeType,
  onChangeContact,
  onApplyFilters,
}: TransactionsFiltersCardProps) {
  const { t } = useTranslation("transactions");
  return (
    <Card className="surface-card rounded-2xl mb-6 reveal-up stagger-1">
      <CardHeader>
        <CardTitle>{t("filters")}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 focus-premium rounded-xl p-1">
            <label className="text-sm font-medium">{t("month")}</label>
            <Select value={month} onValueChange={onChangeMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allMonths")}</SelectItem>
                {monthNames.map((monthName) => (
                  <SelectItem key={monthName} value={monthName}>
                    {monthName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 focus-premium rounded-xl p-1">
            <label className="text-sm font-medium">{t("year")}</label>
            <Input
              id="year"
              type="number"
              step="1"
              value={year}
              onChange={(event) => onChangeYear(event.target.value)}
              placeholder={t("yearPlaceholder")}
              required
            />
          </div>
        </div>
      </CardContent>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2 focus-premium rounded-xl p-1">
            <label className="text-sm font-medium">{t("colCategory")}</label>
            <Select value={filterCategory} onValueChange={onChangeCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                {Object.keys(CategoryList)
                  .filter((key) => Number.isNaN(Number(key)))
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 focus-premium rounded-xl p-1">
            <label className="text-sm font-medium">{t("type")}</label>
            <Select value={filterType} onValueChange={onChangeType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allTypes")}</SelectItem>
                <SelectItem value="INCOME">{t("typeIncome")}</SelectItem>
                <SelectItem value="EXPENSE">{t("typeExpense")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 focus-premium rounded-xl p-1">
            <label className="text-sm font-medium">{t("contact")}</label>
            <Select value={filterContact} onValueChange={onChangeContact}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allContacts")}</SelectItem>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={String(contact.id)}>
                    {contact.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>

      <Button
        variant="outline"
        className="w-full h-16 flex-col gap-2 rounded-b-2xl border-0 border-t border-glass bg-card/45"
        onClick={onApplyFilters}
      >
        {t("applyFilters")}
      </Button>
    </Card>
  );
}
