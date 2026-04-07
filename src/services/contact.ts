import { ContactRequest } from "@/helper/contact";

export const BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllContacts() {
  const url = `${BASE_URL}/Contact/GetAll}`;

  const response = await fetch(url);
  return Array.isArray(response.json()) ? response.json() : [];
}

export async function createContact(input: ContactRequest) {
  const response = await fetch(`${BASE_URL}/Contact/Create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  return response.json() ? response.json() : null;
}

export async function editContact(input: ContactRequest) {
  const response = await fetch(`${BASE_URL}/Contact/EditContact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  return response.json() ? response.json() : null;
}
