// import React, { useEffect, useState } from "react";
// import { useCookies } from "react-cookie";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import BASE_URL from "@/config/config";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// function BranchDetails() {
//   const { uuid } = useParams(); // 👈 get uuid from route
//   const [cookies] = useCookies(["token"]);
//   const token = cookies.token;

//   const [branch, setBranch] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchBranchDetails = async () => {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/api/v3/branch/details/${uuid}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setBranch(res.data.data);
//     } catch (error) {
//       console.error(
//         error?.response?.data?.message || "Failed to fetch branch details"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (uuid) fetchBranchDetails();
//   }, [uuid]);

//   if (loading) return <p>Loading...</p>;
//   if (!branch) return <p>No branch found</p>;

//   return (
//     <Card className="max-w-3xl mx-auto mt-6">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-3">
//           {branch.name}
//           <Badge variant={branch.active ? "success" : "destructive"}>
//             {branch.active ? "Active" : "Inactive"}
//           </Badge>
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="space-y-2 text-sm">
//         <p><b>Address:</b> {branch.address}</p>
//         <p><b>Location:</b> {branch.location}</p>
//         <p><b>Emirate:</b> {branch.emirate}</p>
//         <p><b>Email:</b> {branch.email}</p>
//         <p><b>Contact:</b> {branch.contactNumber}</p>
//         <p><b>Created By:</b> {branch.createdBy}</p>
//         <p><b>Created Date:</b> {branch.createdDate}</p>
//       </CardContent>
//     </Card>
//   );
// }

// export default BranchDetails;


import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config/config";
import ExchangeLayout from "@/components/layout/ExchangeLayout";

// Simple Badge component with success variant added
type BadgeProps = {
  variant?: "default" | "destructive" | "secondary" | "outline" | "success";
  children: React.ReactNode;
};

const Badge: React.FC<BadgeProps> = ({ variant = "default", children }) => {
  const variantClasses: Record<string, string> = {
    default: "bg-gray-200 text-gray-800",
    destructive: "bg-red-500 text-white",
    secondary: "bg-blue-500 text-white",
    outline: "border border-gray-300 text-gray-800",
    success: "bg-green-500 text-white",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
};

// Simple Card components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={`border rounded shadow p-4 ${className}`}>{children}</div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-2">{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <h2 className={`text-lg font-bold ${className}`}>{children}</h2>;

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={className}>{children}</div>;

function BranchDetails() {
  const { uuid } = useParams();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBranchDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v3/branch/details/${uuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranch(res.data.data);
    } catch (error) {
      console.error(
        (error as any)?.response?.data?.message || "Failed to fetch branch details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uuid) fetchBranchDetails();
  }, [uuid]);

  if (loading) return <p>Loading...</p>;
  if (!branch) return <p>No branch found</p>;

  return (
    <ExchangeLayout>
    <Card className="max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {branch.name}
          <Badge variant={branch.active ? "success" : "destructive"}>
            {branch.active ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <p>
          <b>Address:</b> {branch.address}
        </p>
        <p>
          <b>Location:</b> {branch.location}
        </p>
        <p>
          <b>Emirate:</b> {branch.emirate}
        </p>
        <p>
          <b>Email:</b> {branch.email}
        </p>
        <p>
          <b>Contact:</b> {branch.contactNumber}
        </p>
        <p>
          <b>Created By:</b> {branch.createdBy}
        </p>
        <p>
          <b>Created Date:</b> {branch.createdDate}
        </p>
      </CardContent>
    </Card>
    </ExchangeLayout>
  );
}

export default BranchDetails;
