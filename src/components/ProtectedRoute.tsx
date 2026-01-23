// import { Navigate, useLocation, Outlet } from "react-router-dom";
// import { useCookies } from "react-cookie";

// interface ProtectedRouteProps {
//   allowedRole: "ROLE_ADMIN" | "ROLE_STAFF" | "ROLE_BUSINESS";
// }

// const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
//   const [cookies] = useCookies(["token", "role"]);
//   const location = useLocation();

//   // 1. Check if authenticated
//   if (!cookies.token) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   console.log("token", cookies.token);

//   // 2. Check if authorized for this specific department
//   if (cookies.role !== allowedRole) {
//     // If they try to cross departments, redirect them to their specific home
//     const roleRedirects: Record<string, string> = {
//       ROLE_ADMIN: "/exchange",
//       ROLE_STAFF: "/branch",
//       ROLE_BUSINESS: "/portal",
//     };

//     const targetPath = roleRedirects[cookies.role] || "/";
//     return <Navigate to={targetPath} replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useCookies } from "react-cookie";

// interface ProtectedRouteProps {
//   allowedRoles: string[];
// }

// const BRANCH_ROLES = [
//   "ROLE_KYB_OFFICER",
//   "ROLE_SENIOR_KYB_OFFICER",
//   "ROLE_BRANCH_MANAGER",
//   "ROLE_EXCHANGE_ADMIN",
// ];

// const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
//   const [cookies] = useCookies(["token", "role"]);
//   const location = useLocation();

//   console.log("hami yeta xau");
//   console.log(cookies.token);

//   // 🔐 1. Not authenticated
//   if (!cookies.token) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   const role = cookies.role;

//   // ✅ 2. Allowed for this route
//   if (allowedRoles.includes(role)) {
//     return <Outlet />;
//   }

//   // 🔁 3. Global redirect rules (based on backend roles)

//   // Exchange Admin
//   if (role === "EXCHANGE_ADMIN") {
//     return <Navigate to="/exchange" replace />;
//   }

//   // Branch (KYB / Manager)
//   if (BRANCH_ROLES.includes(role)) {
//     return <Navigate to="/branch" replace />;
//   }

//   // Portal (Staff)
//   if (role === "STAFF") {
//     return <Navigate to="/portal" replace />;
//   }

//   // ❌ Unknown role
//   return <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const BRANCH_ROLES = [
  "ROLE_KYB_OFFICER",
  "ROLE_SENIOR_KYB_OFFICER",
  "ROLE_BRANCH_MANAGER",
  "ROLE_EXCHANGE_ADMIN",
];

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const [cookies] = useCookies(["token", "role"]);
  const location = useLocation();

  console.log("hami yeta xau aaaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaaaa");
  console.log(cookies.token);

  // 🔐 1. Not authenticated
  if (!cookies.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = cookies.role;

  // ✅ 2. Allowed for this route
  if (allowedRoles.includes(role)) {
    return <Outlet />;
  }

  // 🔁 3. Global redirect rules (based on backend roles)

  // Exchange Admin
  if (role === "EXCHANGE_ADMIN") {
    return <Navigate to="/exchange" replace />;
  }

  // Branch (KYB / Manager)
  if (BRANCH_ROLES.includes(role)) {
    return <Navigate to="/branch" replace />;
  }

  // Portal (Staff)
  if (role === "STAFF") {
    return <Navigate to="/portal" replace />;
  }

  // ❌ Unknown role
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
