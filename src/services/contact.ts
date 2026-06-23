import type { Contact, ContactRequest } from "@/helper/contact";
import { del, getJson, postVoid } from "@/lib/api";

export async function getAllContacts(): Promise<Contact[]> {
  const data = await getJson<unknown>("/Contact/GetAll", undefined, "Falha ao buscar contatos");
  return Array.isArray(data) ? (data as Contact[]) : [];
}

export async function createContact(input: ContactRequest): Promise<void> {
  await postVoid("/Contact/Create", input, { fallback: "Falha ao criar contato" });
}

export async function editContact(input: ContactRequest): Promise<void> {
  await postVoid("/Contact/EditContact", input, { fallback: "Falha ao editar contato" });
}

export async function deleteContact(id: number): Promise<void> {
  await del("/Contact/DeleteContact", { id }, "Falha ao excluir contato");
}
