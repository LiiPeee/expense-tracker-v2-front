import { ContactRequest } from "@/helper/contact";
import { authFetch, BASE_URL, getResponseErrorMessage, readJsonOrThrow } from "@/lib/api";

export async function getAllContacts() {
  const response = await authFetch(`${BASE_URL}/Contact/GetAll`);
  const data = await readJsonOrThrow<unknown>(response, "Falha ao buscar contatos");
  return Array.isArray(data) ? data : [];
}

export async function createContact(input: ContactRequest): Promise<void> {
  const response = await authFetch(`${BASE_URL}/Contact/Create`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response, "Falha ao criar contato"));
  }
}

export async function editContact(input: ContactRequest): Promise<void> {
  const response = await authFetch(`${BASE_URL}/Contact/EditContact`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response, "Falha ao editar contato"));
  }
}

export async function deleteContact(id: number): Promise<void> {
  const response = await authFetch(`${BASE_URL}/Contact/DeleteContact?id=${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response, "Falha ao excluir contato"));
  }
}
