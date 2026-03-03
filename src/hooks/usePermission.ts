import { usePermissions } from "@/contexts/PermissionContext";

export const usePermission = () => {
  const { permissions } = usePermissions();

  const flattenPermissions = (perms: any[]): string[] => {
    let codes: string[] = [];

    perms.forEach((perm) => {
      codes.push(perm.code);
      if (perm.children && perm.children.length > 0) {
        codes.push(...flattenPermissions(perm.children));
      }
    });

    return codes;
  };

  const allCodes = flattenPermissions(permissions);

  const can = (code: string) => {
    return allCodes.includes(code);
  };

  return { can };
};