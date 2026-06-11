import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BusinessOnboardingForm from "@/components/governance/BusinessOnboardingForm";
import {
  Building2,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Plus,
  Search,
} from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import BASE_URL from "@/config/config";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { Button } from "react-day-picker";
import { PermissionGate } from "@/contexts/PermissionGate";
import { Label } from "recharts";
import { Input } from "@/components/ui/input";

const ExchangeBusinessOnboarding = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const navigate = useNavigate();
  const { uuid } = useParams();

  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounceValue, setSearchDebounceValue] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    pendingKYB: 0,
    verified: 0,
    thisMonth: 0,
    lastMonth: 0,
  });
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 0,
  });

  const fetchBusinesses = async (
    page = 0,
    size = 10,
    search = "",
    fromDate = "",
    toDate = "",
  ) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v3/business?page=${page}&size=${size}&search=${search}&fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const responseData = response?.data;

      if (!responseData?.status || !responseData?.data) {
        console.warn(
          "Invalid API response:",
          responseData?.message || "No data",
        );
        setBusinesses([]);
        return;
      }

      const apiData = responseData.data;

      // Map businesses from data.businesses.items
      setBusinesses(apiData?.businesses?.items || []);

      // Map pagination from data.businesses.pagination
      setPagination({
        pageNumber: apiData?.businesses?.pagination?.page || 0,
        pageSize: apiData?.businesses?.pagination?.size || 10,
        totalPages: apiData?.businesses?.pagination?.totalPages || 1,
        totalElements: apiData?.businesses?.pagination?.totalItems || 0,
      });

      // Update stats from the dashboard object in the response
      if (apiData?.dashboard) {
        setStats((prev) => ({
          ...prev,
          totalBusinesses: apiData.dashboard.totalBusinesses || 0,
          pendingKYB: apiData.dashboard.pendingKYB || 0,
          verified: apiData.dashboard.verified || 0,
          thisMonth: apiData.dashboard.thisMonth || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v3/dashboard/business-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const responseData = response?.data;
      if (responseData?.status && responseData?.data) {
        const apiData = responseData.data;
        setStats((prev) => ({
          ...prev,
          ...apiData,
        }));
      }
    } catch (error) {
      console.error("Error fetching extra stats:", error);
    }
  };

  const refreshData = () => {
    fetchBusinesses(pagination.pageNumber, pagination.pageSize);
    fetchStats();
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchDebounceValue(searchTerm);
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    fetchBusinesses(
      pagination.pageNumber,
      pagination.pageSize,
      searchDebounceValue,
      fromDate,
      toDate,
    );
    fetchStats();
  }, [
    pagination.pageNumber,
    pagination.pageSize,
    searchDebounceValue,
    fromDate,
    toDate,
  ]);

  const getKYBStatusBadge = (status) => {
    switch (status) {
      case "VERIFIED":
      case "APPROVED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    return status === "APPROVED" || status === "ACTIVE" ? (
      <Badge variant="default">Active</Badge>
    ) : (
      <Badge variant="secondary">Pending</Badge>
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, pageNumber: newPage }));
    }
  };

  const thisMonthChange = stats.thisMonth - (stats.lastMonth || 0);
  const thisMonthChangeText = `${
    thisMonthChange >= 0 ? "+" : ""
  }${thisMonthChange} from last month`;

  return (
    <ExchangeLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Business Onboarding
            </h1>
            <p className="text-muted-foreground">
              Register and manage new business accounts
            </p>
          </div>
          {/*<BusinessOnboardingForm onSuccess={refreshData} />*/}

          <PermissionGate permission="BTN_ONBOARD_BUSINESS">
            <BusinessOnboardingForm onSuccess={refreshData} />
          </PermissionGate>

          {/*{role === "ROLE_EXCHANGE_USER" && can("BTN_ONBOARD_BUSINESS") ? (
            <BusinessOnboardingForm onSuccess={refreshData} />
          ) : (
            <BusinessOnboardingForm onSuccess={refreshData} />
          )}*/}
          {/*{can("BTN_ONBOARD_BUSINESS") && <BusinessOnboardingForm onSuccess={refreshData} />}*/}
          {/*{can("BTN_ONBOARD_BUSINESS") && <BusinessOnboardingForm />}*/}
          {/*{can("BTN_ONBOARD_BUSINESS") ? (
            <BusinessOnboardingForm />
          ) : (
            <Button disabled variant="business">
              <Plus className="h-4 w-4 mr-2" /> Onboard Business (No Permission)
            </Button>
          )}*/}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Businesses
              </CardTitle>
              <Building2 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalBusinesses}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats.thisMonth} this month
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending KYB
              </CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.pendingKYB}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Verified
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.verified}
              </div>
              <p className="text-xs text-muted-foreground">Active accounts</p>
            </CardContent>
          </Card>
          <Card className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Month
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.thisMonth}
              </div>
              <p className="text-xs text-muted-foreground">
                {thisMonthChangeText}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recently Onboarded Businesses */}

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-1">
                <label className="text-base font-medium text-gray-800">
                  Search OnBoard Business
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by business"
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      pagination.pageNumber = 0;
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium text-gray-800">
                  From Date
                </label>
                <input
                  className="border border-gray-300 rounded-md p-1 text-gray-500 font-normal text-base h-[40px]"
                  type="date"
                  placeholder="From Date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e?.target?.value);
                    pagination.pageNumber = 0;
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium text-gray-800">
                  To Date
                </label>
                <input
                  className="border border-gray-300 rounded-md p-1 text-gray-500 font-normal text-base h-[40px]"
                  type="date"
                  placeholder="To Date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e?.target?.value);
                    pagination.pageNumber = 0;
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recently Onboarded Businesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p className="text-gray-600 font-normal text-base text-center pt-3">
                  Loading...
                </p>
              ) : businesses.length > 0 ? (
                businesses.map((business) => (
                  <Card
                    key={business.id}
                    className="hover:shadow-md transition-smooth"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">
                                {business.companyName}
                              </h3>
                              {/* {getStatusBadge(business.status)} */}
                              {getKYBStatusBadge(business.status)}
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                              <div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Business ID:
                                  </span>
                                  <span className="ml-2 font-medium">
                                    {business.id}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-muted-foreground">
                                    Onboarded:
                                  </span>
                                  <span className="ml-2 font-medium">
                                    {business.createdDate}
                                  </span>
                                </div>

                                <div className="col-span-2">
                                  <span className="text-muted-foreground">
                                    Contact:
                                  </span>
                                  <span className="ml-2 font-medium">
                                    {business.businessEmail}

                                    <span className="ml-2 font-medium">
                                      {business.businessPhone}
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Country of Trade:
                                  </span>

                                  <span className="ml-2 font-medium">
                                    {Array.isArray(business.country)
                                      ? business.country.join(", ")
                                      : business.country || "-"}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-muted-foreground">
                                    Supported Currencies:
                                  </span>
                                  <span className="ml-2 font-medium">
                                    {business.supportedCurrencies?.join(", ")}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Trade License:
                                  </span>
                                  <span className="ml-2 font-medium">
                                    {business.tradeLicense}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No businesses found.
                </div>
              )}
            </div>

            {/* {pagination.totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pagination.pageNumber - 1);
                      }}
                      className={
                        pagination.pageNumber === 0
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(index);
                        }}
                        isActive={pagination.pageNumber === index}
                        className="cursor-pointer"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pagination.pageNumber + 1);
                      }}
                      className={
                        pagination.pageNumber === pagination.totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )} */}

            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.pageNumber - 1);
                    }}
                    className={
                      pagination.pageNumber === 0
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(index);
                      }}
                      isActive={pagination.pageNumber === index}
                      className="cursor-pointer"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.pageNumber + 1);
                    }}
                    className={
                      pagination.pageNumber === pagination.totalPages - 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </div>
    </ExchangeLayout>
  );
};

export default ExchangeBusinessOnboarding;
