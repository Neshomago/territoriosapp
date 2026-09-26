// Jerarquía de roles: superuser > manager > admin > user
const ROLE_RANK = { user: 0, admin: 1, manager: 2, superuser: 3 };

// Perfiles legacy (creados antes de este cambio) no tienen `status`,
// así que su ausencia se interpreta como "aprobado" para no bloquear
// cuentas existentes.
export function isUserApproved(profile) {
  if (!profile) return false;
  if (profile.status === undefined) return true;
  return profile.status === "approved";
}

// Perfiles legacy tampoco tienen `role` (string), solo `roles` (array).
// Si `roles` incluye "admin" se resuelve como admin; si no, como user base.
export function getUserRole(profile) {
  if (!profile) return "user";
  if (typeof profile.role === "string") return profile.role;
  if (Array.isArray(profile.roles) && profile.roles.includes("admin")) {
    return "admin";
  }
  return "user";
}

export function roleAtLeast(profile, minRole) {
  return ROLE_RANK[getUserRole(profile)] >= ROLE_RANK[minRole];
}

// ¿Puede `actingProfile` asignarle `newRole` a alguien que hoy tiene
// `targetCurrentRole`? superuser puede todo; manager puede asignar hasta
// 'manager' y nunca puede tocar a alguien que ya es superuser.
export function canAssignRole(actingProfile, targetCurrentRole, newRole) {
  const actingRole = getUserRole(actingProfile);

  if (actingRole === "superuser") return true;
  if (actingRole !== "manager") return false;

  return targetCurrentRole !== "superuser" && newRole !== "superuser";
}

export const ASSIGNABLE_ROLES = ["user", "admin", "manager", "superuser"];
