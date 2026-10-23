import { create } from "zustand";

export type Role = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "ADMISSION_MANAGER" | "COUNSELLOR" | "ACCOUNTANT" | "TEACHER" | "CMS_EDITOR";
export type AuthUser = { id: string; email: string; name: string; role: Role };

type AuthState = { user: AuthUser | null; setUser: (user: AuthUser | null) => void };

export const useAuth = create<AuthState>((set) => ({ user: null, setUser: (user) => set({ user }) }));

export const isAdminRole = (role?: Role | null) => role === "ADMIN" || role === "SUPER_ADMIN";
export const canManageAdmissions = (role?: Role | null) => isAdminRole(role) || role === "ADMISSION_MANAGER";
export const canUseCms = (role?: Role | null) => isAdminRole(role) || role === "CMS_EDITOR";

export function defaultWorkspace(role?: Role | null) {
  return role === "CMS_EDITOR" ? "/admin" : role === "TEACHER" ? "/crm/attendance" : role === "ACCOUNTANT" ? "/crm/fees" : "/crm";
}

export function canAccessPage(role: Role | null | undefined, path: string): boolean {
  if (!role) return false;
  if (isAdminRole(role)) return true;
  if (path.startsWith("/admin")) return role === "CMS_EDITOR" && !path.startsWith("/admin/activity");
  if (path === "/crm/account") return true;
  if (role === "CMS_EDITOR") return false;
  if (path.startsWith("/crm/staff")) return false;
  if (role === "ACCOUNTANT") return ["/crm/fees", "/crm/students", "/crm/guardians", "/crm/academics", "/crm/reports"].some(prefix => path === prefix || path.startsWith(prefix + "/"));
  if (role === "TEACHER") return ["/crm/attendance", "/crm/students", "/crm/academics", "/crm/reports"].some(prefix => path === prefix || path.startsWith(prefix + "/"));
  if (role === "ADMISSION_MANAGER") return !path.startsWith("/crm/fees");
  return !["/crm/students", "/crm/guardians", "/crm/academics", "/crm/attendance", "/crm/settings", "/crm/fees"].some(prefix => path === prefix || path.startsWith(prefix + "/"));
}

/** True for ADMIN and SUPER_ADMIN; used to hide actions the API would reject for staff. */
export function useIsAdmin() {
  return useAuth((state) => isAdminRole(state.user?.role));
}
