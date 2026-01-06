import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

interface ProtectedRouteProps {
  allowedRole: "ROLE_ADMIN" | "ROLE_STAFF" | "ROLE_BUSINESS";
}

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const [cookies] = useCookies(["token", "role"]);
  const location = useLocation();

  // 1. Check if authenticated
  if (!cookies.token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log("token", cookies.token);

  // 2. Check if authorized for this specific department
  if (cookies.role !== allowedRole) {
    // If they try to cross departments, redirect them to their specific home
    const roleRedirects: Record<string, string> = {
      ROLE_ADMIN: "/exchange",
      ROLE_STAFF: "/branch",
      ROLE_BUSINESS: "/portal",
    };

    const targetPath = roleRedirects[cookies.role] || "/";
    return <Navigate to={targetPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
