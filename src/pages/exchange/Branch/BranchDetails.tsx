import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config/config";
import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { IoMdArrowRoundBack } from "react-icons/io";

function BranchDetails() {
  const { uuid } = useParams();
  const [cookies] = useCookies(["token", "currencyCode"]);
  const navigate = useNavigate();
  const token = cookies?.token;
  const currencyCode = cookies?.currencyCode;

  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBranchDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v3/branch/details/${uuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranch(res?.data?.data);
    } catch (error) {
      console.error("Failed to fetch branch details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uuid) fetchBranchDetails();
  }, [uuid]);

  const safe = (val: any) => val ?? 0;

  const getEfficiencyColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 50) return "text-yellow-600";
    return "text-red-500";
  };

  if (loading) {
    return (
      <ExchangeLayout>
        <div className="max-w-5xl mx-auto mt-10 animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </ExchangeLayout>
    );
  }

  if (!branch) {
    return (
      <ExchangeLayout>
        <div className="text-center mt-20">
          <h2 className="text-xl font-semibold">Branch Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go Back
          </button>
        </div>
      </ExchangeLayout>
    );
  }

  return (
    <ExchangeLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Back Button + Header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-black mb-3"
          >
            <IoMdArrowRoundBack className="mr-1" />
            Back
          </button>

          <h1 className="text-2xl font-bold">{branch?.name}</h1>
          <p className="text-gray-500 text-sm">
            Branch full details & performance overview
          </p>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border bg-blue-50 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">
              {safe(branch?.kybCompleted)}
            </p>
            <p className="text-xs text-gray-500 mt-1">KYB Completed</p>
          </div>

          <div className="p-5 rounded-xl border bg-green-50 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">
              {safe(branch?.transactionsCompleted)?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Transactions</p>
          </div>

          <div className="p-5 rounded-xl border bg-orange-50 text-center shadow-sm">
            <p className="text-2xl font-bold text-orange-600">
              {currencyCode} {safe(branch.monthlyVolume)?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Monthly Volume</p>
          </div>
        </div>

        {/* ================= MAIN DETAILS CARD ================= */}
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold">Branch Information</h2>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Detail label="Address" value={branch?.address} />
            <Detail label="Location" value={branch?.location} />
            <Detail label="City" value={branch?.city} />
            <Detail label="Email" value={branch?.email} />
            <Detail label="Contact" value={branch?.contactNumber} />
            <Detail label="Created By" value={branch?.createdBy} />
            <Detail label="Created Date" value={branch?.createdDate} />
          </div>
        </div>
      </div>
    </ExchangeLayout>
  );
}

/* ---------------- Helper Component ---------------- */
const Detail = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col p-3 border rounded-lg bg-gray-50">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800">
      {value || "Not provided"}
    </span>
  </div>
);

export default BranchDetails;
