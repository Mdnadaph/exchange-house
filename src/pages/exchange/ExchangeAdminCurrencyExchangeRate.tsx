import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Banknote, FileText, Loader2, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCookies } from "react-cookie";
import axios from "axios";
import BASE_URL from "@/config/config";
export default function ExchangeAdminCurrencyExchangeRate() {
  const { toast } = useToast();
  const [cookies] = useCookies(["token", "currencyCode"]);
  const token = cookies?.token;
  const currencyCode = cookies?.currencyCode;
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [exchnageRateData, setExchangeRateData] = useState([]);

  const fetchExchangeRate = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/exchange_rate/${currencyCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res?.data?.status) {
        setExchangeRateData(res?.data?.data);
      } else {
        toast({
          title: "Error",
          description:
            res?.data?.message ||
            "Something went wrong while fetching exchnage rate",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          "Something went wrong while fetching exchnage rate",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExchangeRate();
  }, [currencyCode]);

  const filteredExchangeRate = useMemo(() => {
    if (!searchValue.trim()) return exchnageRateData;
    const query = searchValue.trim().toLocaleLowerCase();
    return exchnageRateData?.filter((item: { name: string }) =>
      item?.name?.toLocaleLowerCase().includes(query),
    );
  }, [searchValue, exchnageRateData]);
  return (
    <ExchangeLayout>
      <div className="space-y-6">
        {/* Page Header */}

        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Currency Exchange Rate
          </h1>
          <p className="text-muted-foreground">
            Manage exchange rates across currencies
          </p>
        </div>
        <Card className="shadow-card">
          <CardContent className="p-6 space-y-1">
            <Label htmlFor="search" className="mb-1 block">
              Search Currency Exchange Rate
            </Label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by currency exchange rate"
                value={searchValue}
                onChange={(e) => {
                  setCurrentPage(0);
                  setSearchValue(e.target.value);
                }}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Loading Currency Exchange Rate...
              </p>
            </div>
          </div>
        ) : filteredExchangeRate?.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Country and Currency found
            </h3>
          </div>
        ) : (
          <Card className="shadow-card p-6 space-y-6">
            {filteredExchangeRate?.map(
              (item: {
                id: number;
                name: string;
                rate: number;
                processingFee: number;
              }) => (
                <Card key={item?.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="space-y-4 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                            <Banknote className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-foreground">
                              {item?.name?.toUpperCase()}
                            </h4>
                            <div className="text-sm text-muted-foreground w-full flex items-center gap-3">
                              <div>Exchange Rate: </div>
                              <div className="">
                                1 {item?.name?.toUpperCase()}=
                                {item?.rate?.toFixed(4)} {currencyCode}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </Card>
        )}
      </div>
    </ExchangeLayout>
  );
}
