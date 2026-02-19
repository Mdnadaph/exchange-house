import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import AdminLayout from '@/components/layout/AdminLayout';
import BASE_URL from '@/config/config';
import { useNavigate } from 'react-router-dom';

// Optional: better to move this to a central types file later
interface ExchangeAdminDetail {
  id: number;
  uuid: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  primaryContactMail: string;
  active: boolean;
  legalBusinessName: string;
  tradingName: string;
  registrationNumber: string;
  centralBankLicense: string;
  licenseExpiryDate: string;
  businessAddress: string;
  city: string;
  country: string;
  countryId: number;
  postalCode: string;
  subscriptionPlan: {
    id: number;
    name: string;
    price: number;
    branchLimit: number;
  };
  subscriptionStartDate: string;
  subscriptionStatus: string;
  exchangeStatus: string;
  needsPasswordChange: boolean;
}

interface ApiResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: ExchangeAdminDetail;
}

export default function AdminExchangeHouseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const [detail, setDetail] = useState<ExchangeAdminDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!id) {
      setError('No exchange house ID provided');
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get<ApiResponse>(
          `${BASE_URL}/api/v3/super/exchange-admins/${id}/detail`,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );

        if (res.data.status && res.data.data) {
          setDetail(res.data.data);
        } else {
          setError(res.data.message || 'Failed to load data');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, cookies.token]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  if (!detail) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">No data found for this exchange house.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Exchange House Details
            </h1>
            <p className="text-gray-600 mt-1">
              ID: {detail.id} • UUID: {detail.uuid.slice(0, 8)}...
            </p>
          </div>
          <div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                detail.exchangeStatus === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : detail.exchangeStatus === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {detail.exchangeStatus}
            </span>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Basic Information
              </h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <DetailRow label="Full Name" value={detail.fullName} />
              <DetailRow label="Legal Business Name" value={detail.legalBusinessName} />
              <DetailRow label="Trading Name" value={detail.tradingName} />
              <DetailRow label="Active" value={detail.active ? 'Yes' : 'No'} />
              <DetailRow
                label="Status"
                value={
                  <span
                    className={`font-medium ${
                      detail.active ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {detail.active ? 'Active' : 'Inactive'}
                  </span>
                }
              />
            </div>
          </div>

          {/* Right Column - Contact & License */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Contact & License
              </h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <DetailRow label="Phone Number" value={detail.phoneNumber} />
              <DetailRow label="Email" value={detail.email} />
              <DetailRow label="Primary Contact Email" value={detail.primaryContactMail} />
              <DetailRow label="License Number" value={detail.centralBankLicense} />
              <DetailRow
                label="License Expiry"
                value={detail.licenseExpiryDate}
              />
            </div>
          </div>

          {/* Full Width - Address */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Address</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <DetailRow label="Business Address" value={detail.businessAddress} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DetailRow label="City" value={detail.city} />
                <DetailRow label="Country" value={detail.country} />
                <DetailRow label="Postal Code" value={detail.postalCode} />
              </div>
            </div>
          </div>

          {/* Subscription & Status */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Subscription & Account Status
              </h3>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DetailRow
                label="Plan"
                value={`${detail.subscriptionPlan.name} ($${detail.subscriptionPlan.price})`}
              />
              <DetailRow
                label="Branch Limit"
                value={detail.subscriptionPlan.branchLimit.toString()}
              />
              <DetailRow
                label="Start Date"
                value={detail.subscriptionStartDate}
              />
              <DetailRow
                label="Subscription"
                value={
                  <span className="font-medium text-green-600">
                    {detail.subscriptionStatus}
                  </span>
                }
              />
              <DetailRow
                label="Needs Password Change"
                value={
                  detail.needsPasswordChange ? (
                    <span className="text-amber-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-green-600 font-medium">No</span>
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Actions (optional) */}
        <div className="mt-8 flex justify-end gap-4">
          <button onClick={handleGoBack} className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
            Back
          </button>
          {/* <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Edit Details
          </button> */}
        </div>
      </div>
    </AdminLayout>
  );
}

// Reusable row component
type DetailRowProps = {
  label: string;
  value: React.ReactNode;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between py-1">
      <dt className="text-sm font-medium text-gray-600">{label}</dt>
      <dd className="mt-1 sm:mt-0 text-sm text-gray-900 font-medium">
        {value || <span className="text-gray-400">—</span>}
      </dd>
    </div>
  );
}