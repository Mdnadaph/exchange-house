// components/PermissionGate.tsx
import { ReactNode } from "react";
import { useCookies } from "react-cookie";
import { usePermission } from "@/hooks/usePermission";

interface PermissionGateProps {
  /** The permission code required (e.g. "BTN_ONBOARD_BUSINESS") */
  permission: string;
  /** Content to show when access is granted */
  children: ReactNode;
  /** Optional fallback when access is denied (defaults to null) */
  fallback?: ReactNode;
}

export const PermissionGate = ({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) => {
  const [cookies] = useCookies(["role"]);
  const { can } = usePermission();
  const role = cookies.role;

  // Define which roles bypass permission checks (here just EXCHANGE_ADMIN)
  const adminRoles = ["ROLE_EXCHANGE_ADMIN"];

  const isAdmin = adminRoles.includes(role);
  const hasPermission = can(permission);

  // Condition: admin OR (exchange user with permission)
  const hasAccess =
    isAdmin ||
    (["ROLE_EXCHANGE_USER", "ROLE_BRANCH_MANAGER"].includes(role) &&
      hasPermission);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
