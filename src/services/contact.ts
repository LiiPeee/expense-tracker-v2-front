import { ContactRequest } from "@/helper/contact";
import { authFetch, BASE_URL, readJsonOrThrow } from "@/lib/api";

export async function getAllContacts() {
  const response = await authFetch(`${BASE_URL}/Contact/GetAll`);
  const data = await readJsonOrThrow<unknown>(response, "Falha ao buscar contatos");
  return Array.isArray(data) ? data : [];
}

export async function createContact(input: ContactRequest): Promise<boolean> {
  const response = await authFetch(`${BASE_URL}/Contact/Create`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.ok;
}

export async function editContact(input: ContactRequest): Promise<boolean> {
  const response = await authFetch(`${BASE_URL}/Contact/EditContact`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.ok;
}
