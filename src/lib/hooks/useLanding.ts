import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSections,
  getSection,
  createSection,
  updateSection,
  deleteSection,
  addSectionImage,
  deleteSectionImage,
  CreateSectionPayload,
  UpdateSectionPayload,
  AddImagePayload,
} from "../api/landing.api";
import { CACHE_TIME } from "../utils/constants";

export function useLandingSections() {
  return useQuery({
    queryKey: ["landing", "sections"],
    queryFn: getSections,
    staleTime: CACHE_TIME.MEDIUM,
  });
}

export function useLandingSection(sectionId: string) {
  return useQuery({
    queryKey: ["landing", "section", sectionId],
    queryFn: () => getSection(sectionId),
    staleTime: CACHE_TIME.MEDIUM,
    enabled: !!sectionId,
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSectionPayload) => createSection(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing", "sections"] });
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSectionPayload;
    }) => updateSection(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["landing", "section", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["landing", "sections"] });
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing", "sections"] });
    },
  });
}

export function useAddSectionImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddImagePayload) => addSectionImage(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["landing", "section", variables.sectionId],
      });
      queryClient.invalidateQueries({ queryKey: ["landing", "sections"] });
    },
  });
}

export function useDeleteSectionImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      imageId,
      sectionId,
    }: {
      imageId: string;
      sectionId: string;
    }) => deleteSectionImage(imageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["landing", "section", variables.sectionId],
      });
      queryClient.invalidateQueries({ queryKey: ["landing", "sections"] });
    },
  });
}

export function usePublicLandingSections() {
  return useQuery({
    queryKey: ["landing", "public", "sections"],
    queryFn: getSections,
    staleTime: CACHE_TIME.LONG,
  });
}
