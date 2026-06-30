import { Contact, ContactForm, contactFormDefaults, mapContactFormToRequest, mapContactToForm } from "@/helper/contact";
import { useContactsQuery } from "@/hooks/contact/use-contacts-query";
import { getErrorMessage } from "@/lib/api";
import { createContact, deleteContact, editContact } from "@/services/contact";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useContact() {
  const { t } = useTranslation("contacts");
  const queryClient = useQueryClient();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { contacts, error, isFetching, refetch } = useContactsQuery();
  const lastErrorMessageRef = useRef<string | null>(null);

  // Stable per editing entity so the dialog only resets when the target changes, not on every keystroke.
  const contactDefaults = useMemo<ContactForm>(
    () => (editingContact ? mapContactToForm(editingContact) : contactFormDefaults),
    [editingContact],
  );

  const createContactMutation = useMutation({
    mutationFn: createContact,
  });
  const editContactMutation = useMutation({
    mutationFn: editContact,
  });
  const deleteContactMutation = useMutation({
    mutationFn: deleteContact,
  });

  useEffect(() => {
    if (!error) {
      lastErrorMessageRef.current = null;
      return;
    }

    const message = getErrorMessage(error, t("loadError"));
    if (message === lastErrorMessageRef.current) return;

    lastErrorMessageRef.current = message;
    toast.error(message);
  }, [error, t]);

  const submitContact = async (data: ContactForm) => {
    try {
      const contactPayload = mapContactFormToRequest(data, editingContact?.id);

      if (editingContact) {
        await editContactMutation.mutateAsync(contactPayload);
        toast.success(t("editSuccess"));
      } else {
        await createContactMutation.mutateAsync(contactPayload);
        toast.success(t("createSuccess"));
      }

      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setIsDialogOpen(false);
      setEditingContact(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, t("saveError")));
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteContactMutation.mutateAsync(id);
      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success(t("deleteSuccess"));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, t("deleteError")));
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setEditingContact(null);
  };

  const getAllContact = useCallback(async () => {
    const result = await refetch();
    if (result.error) {
      const message = getErrorMessage(result.error, t("loadError"));
      toast.error(message);
      throw result.error;
    }

    return result.data ?? [];
  }, [refetch, t]);

  return {
    handleDelete,
    handleEdit,
    submitContact,
    onOpenChange,
    getAllContact,
    contactDefaults,
    editingContact: Boolean(editingContact),
    contacts,
    isRefreshing:
      isFetching ||
      createContactMutation.isPending ||
      editContactMutation.isPending ||
      deleteContactMutation.isPending,
    isDialogOpen,
  };
}
