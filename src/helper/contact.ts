export type ContactTypeValue = "1" | "2";

export interface Contact {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  document?: string | null;
  typeContact?: string | number;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isPrimary?: boolean;
}

export interface ContactRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  typeContact: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  document: string;
  typeContact: ContactTypeValue | "";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
}
export const contactFormDefaults: ContactForm = {
  name: "",
  email: "",
  phone: "",
  document: "",
  typeContact: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  isPrimary: true,
};

export function mapContactFormToRequest(form: ContactForm): ContactRequest {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    document: form.document.trim(),
    typeContact: Number(form.typeContact),
    street: form.street.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    zipCode: form.zipCode.trim(),
    country: form.country.trim(),
    isPrimary: form.isPrimary,
  };
}

export function mapContactToForm(contact: Contact): ContactForm {
  const typeContact = contact.typeContact == null ? "" : (String(contact.typeContact) as ContactTypeValue | "");

  return {
    ...contactFormDefaults,
    name: contact.name ?? "",
    email: contact.email ?? "",
    phone: contact.phone ?? "",
    document: contact.document ?? "",
    typeContact,
    street: contact.street ?? "",
    city: contact.city ?? "",
    state: contact.state ?? "",
    zipCode: contact.zipCode ?? "",
    country: contact.country ?? "",
    isPrimary: contact.isPrimary ?? true,
  };
}

export function validateContactForm(form: ContactForm): string[] {
  const errors: string[] = [];

  if (!form.name.trim()) errors.push("Nome é obrigatório");
  if (!form.email.trim()) errors.push("E-mail é obrigatório");
  if (!form.phone.trim()) errors.push("Telefone é obrigatório");
  if (!form.document.trim()) errors.push("Documento é obrigatório");
  if (!form.typeContact) errors.push("Tipo de contato é obrigatório");
  if (!form.street.trim()) errors.push("Rua é obrigatória");
  if (!form.city.trim()) errors.push("Cidade é obrigatória");
  if (!form.state.trim()) errors.push("Estado é obrigatório");
  if (!form.zipCode.trim()) errors.push("CEP é obrigatório");
  if (!form.country.trim()) errors.push("Pais é obrigatorio");

  return errors;
}
