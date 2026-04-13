import { ContactRequest } from "@/helper/contact";
import { authFetch } from "@/lib/api";

export const BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllContacts() {
  const response = await authFetch(`${BASE_URL}/Contact/GetAll`);
  if (!response.ok) throw new Error("Falha ao buscar contatos");

  const data = await response.json();
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
