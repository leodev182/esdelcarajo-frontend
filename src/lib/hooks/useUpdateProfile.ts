import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { User } from "../types";

interface UpdateProfilePayload {
  nickname?: string;
  name?: string;
  phone?: string;
}

async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await apiClient.patch("/users/me", payload);
  return data.user;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
