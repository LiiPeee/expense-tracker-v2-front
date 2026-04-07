import {
  Contact,
  ContactForm,
  contactFormDefaults,
  mapContactFormToRequest,
  mapContactToForm,
  validateContactForm,
} from "@/helper/contact";
import { useCepLookup } from "@/hooks/contact/use-cep";
import { createContact, editContact, getAllContacts } from "@/services/contact";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingContact, isEditingContact] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ContactForm>(contactFormDefaults);
  const { lookupCep } = useCepLookup();

  const handleSubmit = async (e: React.FormEvent) => {
    setIsRefreshing(false);
    e.preventDefault();

    const errors = validateContactForm(formData);
    if (errors.length) {
      errors.forEach((message) => toast.error(message));
      return;
    }

    const newContact = mapContactFormToRequest(formData);

    if (await createContact(newContact)) toast.success("Contato criado com sucesso!");
    else toast.error("Contato não foi criado!");

    setIsDialogOpen(false);
    setFormData(contactFormDefaults);
  };

  const handleEdit = async (contact: Contact) => {
    isEditingContact(true);
    setFormData(mapContactToForm(contact));

    const editedContact = mapContactFormToRequest(formData);

    if (await editContact(editedContact)) toast.success("Contato editado com sucesso!");

    setIsDialogOpen(true);

    isEditingContact(false);
  };

  const handleDelete = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    toast.success("Contato excluído com sucesso!");
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
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
    setContacts([]);
    setIsRefreshing(false);
    try {
      const backEndCategory = await getAllContacts();

      console.log(backEndCategory);

      setContacts(backEndCategory);
      setIsRefreshing(false);
    } catch (error) {
      console.log(error);
      setContacts([]);
      setIsRefreshing(false);
    }
  }, []);

  return {
    handleDialogClose,
    handleDelete,
    isEditingContact,
    handleEdit,
    handleSubmit,
    handleZipCodeBlur,
    setIsDialogOpen,
    setFormData,
    setContacts,
    getAllContact,
    editingContact,
    contacts,
    isRefreshing,
    isDialogOpen,
    formData,
  };
}
