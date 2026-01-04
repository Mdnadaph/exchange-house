// import { Navigate, useLocation, Outlet } from "react-router-dom";
// import { useCookies } from "react-cookie";

// const ProtectedRoute = () => {
//   const [cookies] = useCookies(["token"]);
//   const location = useLocation();

//   // Logic: Check if the 'token' cookie exists
//   const isAuthenticated = !!cookies.token;

//   if (!isAuthenticated) {
//     // Redirect to login, but save the current location 
//     // so we can redirect back after successful login
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // If authenticated, render the child routes (the dashboard/page)
//   return <Outlet />;
// };

// export default ProtectedRoute;


import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

interface ProtectedRouteProps {
  allowedRole: "ROLE_ADMIN" | "STAFF" | "BUSINESS";
}

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const [cookies] = useCookies(["token", "role"]);
  const location = useLocation();

  // 1. Check if authenticated
  if (!cookies.token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. Check if authorized for this specific department
  if (cookies.role !== allowedRole) {
    // If they try to cross departments, redirect them to their specific home
    const roleRedirects: Record<string, string> = {
      ROLE_ADMIN: "/exchange",
      STAFF: "/branch",
      BUSINESS: "/portal",
    };

    const targetPath = roleRedirects[cookies.role] || "/";
    return <Navigate to={targetPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;