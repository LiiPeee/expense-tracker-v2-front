import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormTextField } from "@/components/ui/form-text-field";
import { LoadingButton } from "@/components/ui/loading-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { type ContactForm, contactFormSchema } from "@/helper/contact";
import { useCepLookup } from "@/hooks/contact/use-cep";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ContactFormDialogProps {
  editingContact: boolean;
  isDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: ContactForm;
  onSubmit: (data: ContactForm) => Promise<void> | void;
}

export function ContactFormDialog({ editingContact, isDialogOpen, onOpenChange, defaultValues, onSubmit }: ContactFormDialogProps) {
  const { t } = useTranslation("contacts");
  const { lookupCep } = useCepLookup();
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });
  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (isDialogOpen) form.reset(defaultValues);
  }, [isDialogOpen, defaultValues, form]);

  const handleOpenChange = (next: boolean) => {
    if (isSubmitting) return;
    onOpenChange(next);
  };

  // Auto-fill address from the CEP, but never overwrite fields the user already filled.
  const handleZipBlur = async () => {
    const address = await lookupCep(form.getValues("zipCode"));
    if (!address) return;

    const current = form.getValues();
    if (!current.street) form.setValue("street", address.street, { shouldValidate: true });
    if (!current.city) form.setValue("city", address.city, { shouldValidate: true });
    if (!current.state) form.setValue("state", address.state, { shouldValidate: true });
    if (!current.country) form.setValue("country", "Brasil", { shouldValidate: true });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl">
          <Plus className="w-4 h-4" />
          {t("newContact")}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-glass bg-card/90 backdrop-blur-md sm:max-w-[560px] flex flex-col max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{editingContact ? t("editContact") : t("newContact")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="space-y-4 overflow-y-auto flex-1 pr-1">
              <FormTextField control={form.control} name="name" label={t("fieldName")} placeholder={t("namePlaceholder")} />
              <FormTextField control={form.control} name="email" label={t("fieldEmail")} type="email" placeholder={t("emailPlaceholder")} />
              <FormTextField control={form.control} name="phone" label={t("fieldPhone")} placeholder={t("phonePlaceholder")} />
              <FormTextField control={form.control} name="document" label={t("fieldDocument")} placeholder={t("documentPlaceholder")} />

              <FormField
                control={form.control}
                name="typeContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fieldType")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">{t("typePersonal")}</SelectItem>
                        <SelectItem value="2">{t("typeCompany")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormTextField control={form.control} name="street" label={t("fieldStreet")} placeholder={t("streetPlaceholder")} />
              <FormTextField control={form.control} name="city" label={t("fieldCity")} placeholder={t("cityPlaceholder")} />
              <FormTextField control={form.control} name="state" label={t("fieldState")} placeholder={t("statePlaceholder")} />
              <FormTextField control={form.control} name="zipCode" label={t("fieldZip")} placeholder={t("zipPlaceholder")} onBlur={() => void handleZipBlur()} />
              <FormTextField control={form.control} name="country" label={t("fieldCountry")} placeholder={t("countryPlaceholder")} />

              <FormField
                control={form.control}
                name="isPrimary"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border px-3 py-2 space-y-0">
                    <FormLabel>{t("isPrimary")}</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <LoadingButton type="submit" className="w-full rounded-xl mt-4" isLoading={isSubmitting} loadingText={t("saving")}>
              {editingContact ? t("update") : t("create")}
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
