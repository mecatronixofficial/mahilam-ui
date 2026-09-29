import { create } from "zustand";

export type Role = "SUPER_ADMIN" | "ADMIN" | "STAFF";
export type AuthUser = { id: string; email: string; name: string; role: Role };

type AuthState = { user: AuthUser | null; setUser: (user: AuthUser | null) => void };

export const useAuth = create<AuthState>((set) => ({ user: null, setUser: (user) => set({ user }) }));

export const isAdminRole = (role?: Role | null) => role === "ADMIN" || role === "SUPER_ADMIN";

/** True for ADMIN and SUPER_ADMIN; used to hide actions the API would reject for staff. */
export function useIsAdmin() {
  return useAuth((state) => isAdminRole(state.user?.role));
}
