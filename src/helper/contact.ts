import { z } from "zod";

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
  contactId?: string;
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

export function mapContactFormToRequest(form: ContactForm, id?: number): ContactRequest {
  return {
    contactId: id == null ? undefined : String(id),
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

// Mirrors the previous validateContactForm rules exactly (required, non-empty) — surfaced inline via RHF.
// Email keeps the original "required only" rule (no format check) to stay behavior-preserving.
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "validation:nameRequired"),
  email: z.string().trim().min(1, "validation:emailFieldRequired"),
  phone: z.string().trim().min(1, "validation:phoneRequired"),
  document: z.string().trim().min(1, "validation:documentRequired"),
  typeContact: z.enum(["", "1", "2"]).refine((value) => value !== "", "validation:contactTypeRequired"),
  street: z.string().trim().min(1, "validation:streetRequired"),
  city: z.string().trim().min(1, "validation:cityRequired"),
  state: z.string().trim().min(1, "validation:stateRequired"),
  zipCode: z.string().trim().min(1, "validation:zipRequired"),
  country: z.string().trim().min(1, "validation:countryRequired"),
  isPrimary: z.boolean(),
});
