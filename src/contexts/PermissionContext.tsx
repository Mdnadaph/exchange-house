import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";

const PermissionContext = createContext<any>(null);

export const PermissionProvider = ({ children }: any) => {
  const [cookies] = useCookies(["token"]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const token = cookies.token;

  useEffect(() => {
    if (token) fetchPermissions();
  }, [token]);

  const fetchPermissions = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v3/permissions/permissions/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPermissions(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch permissions");
    }
  };

  return (
    <PermissionContext.Provider value={{ permissions }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionContext);
