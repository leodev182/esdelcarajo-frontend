import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateSubcategoryPayload,
  UpdateSubcategoryPayload,
} from "../api/admin-categories.api";

// ==================== CATEGORÍAS ====================

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: string;
      payload: UpdateCategoryPayload;
    }) => updateCategory(categoryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// ==================== SUBCATEGORÍAS ====================

export function useCreateSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubcategoryPayload) =>
      createSubcategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subcategoryId,
      payload,
    }: {
      subcategoryId: string;
      payload: UpdateSubcategoryPayload;
    }) => updateSubcategory(subcategoryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subcategoryId: string) => deleteSubcategory(subcategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
