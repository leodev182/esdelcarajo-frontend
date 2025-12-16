import { apiClient } from "./client";

export interface SectionImage {
  id: string;
  url: string;
  publicId: string;
  alt: string;
  order: number;
}

export interface LandingSection {
  id: string;
  type: "CAROUSEL" | "CUSTOM";
  title: string;
  description?: string;
  textPosition: "LEFT" | "CENTER" | "RIGHT" | "TOP" | "BOTTOM";
  bgColor: string;
  order: number;
  isActive: boolean;
  images: SectionImage[];
}

export interface CreateSectionPayload {
  type: "CAROUSEL" | "CUSTOM";
  title: string;
  description?: string;
  textPosition: "LEFT" | "CENTER" | "RIGHT" | "TOP" | "BOTTOM";
  bgColor: string;
  order: number;
}

export interface UpdateSectionPayload {
  type?: "CAROUSEL" | "CUSTOM";
  title?: string;
  description?: string;
  textPosition?: "LEFT" | "CENTER" | "RIGHT" | "TOP" | "BOTTOM";
  bgColor?: string;
  order?: number;
  isActive?: boolean;
}

export interface AddImagePayload {
  sectionId: string;
  url: string;
  publicId: string;
  alt?: string;
  order: number;
}

export async function getSections(): Promise<LandingSection[]> {
  const { data } = await apiClient.get<LandingSection[]>("/landing/sections");
  return data;
}

export async function getSection(id: string): Promise<LandingSection> {
  const { data } = await apiClient.get<LandingSection>(
    `/landing/sections/${id}`
  );
  return data;
}

export async function createSection(
  payload: CreateSectionPayload
): Promise<LandingSection> {
  const { data } = await apiClient.post<LandingSection>(
    "/landing/sections",
    payload
  );
  return data;
}

export async function updateSection(
  id: string,
  payload: UpdateSectionPayload
): Promise<LandingSection> {
  const { data } = await apiClient.patch<LandingSection>(
    `/landing/sections/${id}`,
    payload
  );
  return data;
}

export async function deleteSection(id: string): Promise<void> {
  await apiClient.delete(`/landing/sections/${id}`);
}

export async function addSectionImage(
  payload: AddImagePayload
): Promise<SectionImage> {
  const { data } = await apiClient.post<SectionImage>(
    "/landing/sections/images",
    payload
  );
  return data;
}

export async function deleteSectionImage(imageId: string): Promise<void> {
  await apiClient.delete(`/landing/sections/images/${imageId}`);
}
