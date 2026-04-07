import { Category, CategoryForm, categoryFormDefaults, mapCategoryFormToRequest, validateCategoryForm } from "@/helper/category";
import { create, getAll } from "@/services/category";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryForm>(categoryFormDefaults);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateCategoryForm(formData);
    if (errors.length) {
      errors.forEach((message) => toast.error(message));
      return;
    }

    if (editingCategory) {
      setCategories(categories.map((cat) => (cat.id === editingCategory.id ? { ...cat, ...formData } : cat)));
      toast.success("Categoria atualizada com sucesso!");
    } else {
      const response = await create(mapCategoryFormToRequest(formData));
      if (!response) toast.error("Categoria não foi criada!");
      else toast.success("Categoria criada com sucesso!");
    }

    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData(categoryFormDefaults);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name ?? "", description: category.description ?? "" });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    toast.success("Categoria excluída com sucesso!");
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData(categoryFormDefaults);
  };

  const getAllCategories = useCallback(async () => {
    setCategories([]);
    setIsRefreshing(false);
    try {
      const backEndCategory = await getAll();

      setCategories(backEndCategory);
      setIsRefreshing(false);
    } catch (error) {
      console.log(error);
      setCategories([]);
      setIsRefreshing(false);
    }
  }, []);

  return {
    getAllCategories,
    handleSubmit,
    handleDialogClose,
    handleDelete,
    handleEdit,
    setIsDialogOpen,
    setEditingCategory,
    setFormData,
    isRefreshing,
    formData,
    editingCategory,
    categories,
    isDialogOpen,
  };
}
