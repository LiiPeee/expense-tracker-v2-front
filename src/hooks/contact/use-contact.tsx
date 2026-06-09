import {
  Contact,
  ContactForm,
  contactFormDefaults,
  mapContactFormToRequest,
  mapContactToForm,
  validateContactForm,
} from "@/helper/contact";
import { useCepLookup } from "@/hooks/contact/use-cep";
import { useContactsQuery } from "@/hooks/contact/use-contacts-query";
import { getErrorMessage } from "@/lib/api";
import { createContact, deleteContact, editContact } from "@/services/contact";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useContact() {
  const queryClient = useQueryClient();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ContactForm>(contactFormDefaults);
  const { lookupCep } = useCepLookup();
  const { contacts, error, isFetching, refetch } = useContactsQuery();
  const lastErrorMessageRef = useRef<string | null>(null);

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

    const message = getErrorMessage(error, "Erro ao carregar contatos.");
    if (message === lastErrorMessageRef.current) return;

    lastErrorMessageRef.current = message;
    toast.error(message);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateContactForm(formData);
    if (errors.length) {
      errors.forEach((message) => toast.error(message));
      return;
    }

    try {
      const contactPayload = mapContactFormToRequest(formData, editingContact?.id);

      if (editingContact) {
        await editContactMutation.mutateAsync(contactPayload);
        toast.success("Contato editado com sucesso!");
      } else {
        await createContactMutation.mutateAsync(contactPayload);
        toast.success("Contato criado com sucesso!");
      }

      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setIsDialogOpen(false);
      setEditingContact(null);
      setFormData(contactFormDefaults);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro inesperado ao salvar contato."));
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData(mapContactToForm(contact));
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteContactMutation.mutateAsync(id);
      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contato excluído com sucesso!");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro inesperado ao excluir contato."));
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingContact(null);
    setFormData(contactFormDefaults);
  };

  const handleZipCodeBlur = async () => {
    const address = await lookupCep(formData.zipCode);
    if (!address) return;

    setFormData((prev) => ({
      ...prev,
      street: prev.street || address.street,
      city: prev.city || address.city,
      state: prev.state || address.state,
      country: prev.country || "Brasil",
    }));
  };

  const getAllContact = useCallback(async () => {
    const result = await refetch();
    if (result.error) {
      const message = getErrorMessage(result.error, "Erro ao carregar contatos.");
      toast.error(message);
      throw result.error;
    }

    return result.data ?? [];
  }, [refetch]);

  return {
    handleDialogClose,
    handleDelete,
    handleEdit,
    handleSubmit,
    handleZipCodeBlur,
    setIsDialogOpen,
    setFormData,
    getAllContact,
    editingContact: Boolean(editingContact),
    contacts,
    isRefreshing:
      isFetching ||
      createContactMutation.isPending ||
      editContactMutation.isPending ||
      deleteContactMutation.isPending,
    isDialogOpen,
    formData,
  };
}
