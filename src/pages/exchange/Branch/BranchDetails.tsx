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
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config/config";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { IoMdArrowRoundBack } from "react-icons/io";

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
      className={`px-4 py-1.5 text-sm font-semibold rounded-full ${variantClasses[variant]}`}
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
  <div
    className={`border border-gray-200 rounded-xl shadow-sm bg-white ${className}`}
  >
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-b border-gray-100 px-6 py-5">{children}</div>
);

const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <h2 className={`text-xl font-bold text-gray-900 ${className}`}>{children}</h2>
);

const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
);

// Loading skeleton component
const LoadingSkeleton = () => (
  <ExchangeLayout>
    <div className="max-w-4xl mx-auto mt-8">
      <Card className="animate-pulse">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </ExchangeLayout>
);

const DetailRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-start py-2 border-b border-gray-300 last:border-b-0">
    <div className="flex items-center w-1/3">
      {icon && <span className="mr-3 text-gray-400">{icon}</span>}
      <span className="text-sm font-medium text-gray-500">{label}</span>
    </div>
    <div className="w-2/3">
      <p className="text-sm text-gray-900 font-medium">
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

// Simple icons (using emojis as placeholders - you can replace with actual icons)
const Icons = {
  location: "📍",
  email: "✉️",
  phone: "📞",
  user: "👤",
  calendar: "📅",
  building: "🏢",
};

function BranchDetails() {
  const { uuid } = useParams();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
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
        (error as any)?.response?.data?.message ||
          "Failed to fetch branch details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uuid) fetchBranchDetails();
  }, [uuid]);

  if (loading) return <LoadingSkeleton />;
  if (!branch)
    return (
      <ExchangeLayout>
        <div className="max-w-4xl mx-auto mt-8">
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 text-5xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Branch Not Found
              </h3>
              <p className="text-gray-500 mb-6">
                The branch you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Back
              </button>
            </CardContent>
          </Card>
        </div>
      </ExchangeLayout>
    );

  return (
    <ExchangeLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex text-center justify-center items-center text-gray-600 hover:text-gray-900 pb-4 transition-colors"
          >
            <span className="mr-2">
              <IoMdArrowRoundBack size={20} />
            </span>{" "}
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 py-1">
            Branch Details
          </h1>
          <p className="text-gray-500">
            Complete information about {branch.name}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{Icons.building}</span>
                {branch.name}
              </CardTitle>
              <Badge variant={branch.active ? "success" : "destructive"}>
                {branch.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-1">
              <DetailRow
                label="Address"
                value={branch.address}
                icon={Icons.location}
              />
              <DetailRow
                label="Location"
                value={branch.location}
                icon={Icons.location}
              />
              <DetailRow
                label="Emirate"
                value={branch.emirate}
                icon={Icons.location}
              />
              <DetailRow
                label="Email Address"
                value={branch.email}
                icon={Icons.email}
              />
              <DetailRow
                label="Contact Number"
                value={branch.contactNumber}
                icon={Icons.phone}
              />
              <DetailRow
                label="Created By"
                value={branch.createdBy}
                icon={Icons.user}
              />
              <DetailRow
                label="Created Date"
                value={branch.createdDate}
                icon={Icons.calendar}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ExchangeLayout>
  );
}

export default BranchDetails;
