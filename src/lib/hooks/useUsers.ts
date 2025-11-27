import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserBan,
} from "../api/users.api";
import type { Role } from "../types";
import { CACHE_TIME } from "../utils/constants";

export function useAllUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
    staleTime: CACHE_TIME.SHORT,
  });
}

export function useUserById(userId: string) {
  return useQuery({
    queryKey: ["admin", "users", userId],
    queryFn: () => getUserById(userId),
    staleTime: CACHE_TIME.SHORT,
    enabled: !!userId,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) =>
      updateUserRole(userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "users", variables.userId],
      });
    },
  });
}

export function useToggleUserBan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => toggleUserBan(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", userId] });
    },
  });
}
