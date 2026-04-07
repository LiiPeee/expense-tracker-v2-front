export interface Category {
  name?: string;
  description?: string;
  id?: number;
}

export interface CategoryForm {
  name: string;
  description: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

export const categoryFormDefaults: CategoryForm = {
  name: "",
  description: "",
};

export function mapCategoryFormToRequest(form: CategoryForm): CategoryRequest {
  return {
    name: form.name.trim(),
    description: form.description.trim() || undefined,
  };
}

export function validateCategoryForm(form: CategoryForm): string[] {
  const errors: string[] = [];

  if (!form.name.trim()) errors.push("Nome é obrigatório");

  return errors;
}

export enum CategoryList {
  "MORADIA",
  "TRANSPORTE",
  "ALIMENTACAO",
  "SAUDE",
  "EDUCACAO",
  "LAZER",
  "BENS_PESSOAIS",
  "INVESTIMENTO",
  "RENDA_VARIAVEL",
  "BENEFICIOS",
  "SALARIO",
  "CONFORTO",
  "OUTROS",
}
