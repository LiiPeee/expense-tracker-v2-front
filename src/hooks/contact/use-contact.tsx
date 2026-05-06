import {
  Contact,
  ContactForm,
  contactFormDefaults,
  mapContactFormToRequest,
  mapContactToForm,
  validateContactForm,
} from "@/helper/contact";
import { useCepLookup } from "@/hooks/contact/use-cep";
import { getErrorMessage } from "@/lib/api";
import { createContact, editContact, getAllContacts } from "@/services/contact";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ContactForm>(contactFormDefaults);
  const { lookupCep } = useCepLookup();

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
        const updated = await editContact(contactPayload);
        if (!updated) {
          toast.error("Contato não foi atualizado!");
          return;
        }

        toast.success("Contato editado com sucesso!");
      } else {
        const created = await createContact(contactPayload);
        if (!created) {
          toast.error("Contato não foi criado!");
          return;
        }

        toast.success("Contato criado com sucesso!");
      }

      await getAllContact();
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

  const handleDelete = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    toast.success("Contato excluído com sucesso!");
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
    setIsRefreshing(true);
    try {
      const data = await getAllContacts();
      setContacts(data);
    } catch (error: unknown) {
      setContacts([]);
      toast.error(getErrorMessage(error, "Erro ao carregar contatos."));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    handleDialogClose,
    handleDelete,
    handleEdit,
    handleSubmit,
    handleZipCodeBlur,
    setIsDialogOpen,
    setFormData,
    setContacts,
    getAllContact,
    editingContact: Boolean(editingContact),
    contacts,
    isRefreshing,
    isDialogOpen,
    formData,
  };
}
