import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

import AdminLayout from "@/components/layout/AdminLayout";
import BASE_URL from "@/config/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function AdminExchangeHouseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v3/super/exchange-admins/${id}/detail`,
          {
            headers: { Authorization: `Bearer ${cookies.token}` },
          },
        );
        setDetail(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, cookies.token]);

  if (loading || !detail)
    return <div className="p-10 text-center">Loading...</div>;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto bg-background p-6 rounded-lg border shadow-sm my-8">
        {/* Header Section - Matches DialogHeader */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Exchange House Details
            </h2>
            <p className="text-sm text-muted-foreground">
              Viewing details for {detail.legalBusinessName}
            </p>
          </div>
          <div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                detail.exchangeStatus === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : detail.exchangeStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {detail.exchangeStatus}
            </span>
          </div>
        </div>

        <div className="space-y-6 py-4">
          {/* Admin / Contact Info Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground underline underline-offset-4 decoration-primary/30">
              Admin Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField label="Full Name" value={detail.fullName} />
              <ViewField label="Admin Email" value={detail.email} />
              <ViewField label="Phone Number" value={detail.phoneNumber} />
              <ViewField
                label="Primary Contact Email"
                value={detail.primaryContactMail}
              />
            </div>
          </div>

          <Separator />

          {/* Business Details Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              Exchange House Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField
                label="Legal Business Name"
                value={detail.legalBusinessName}
              />
              <ViewField label="Trading Name" value={detail.tradingName} />
              <ViewField
                label="Registration Number"
                value={detail.registrationNumber}
              />
              <ViewField
                label="Central Bank License"
                value={detail.centralBankLicense}
              />
              <ViewField
                label="License Expiry Date"
                value={detail.licenseExpiryDate}
              />
            </div>
          </div>

          <Separator />

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Business Address</h3>
            <div className="space-y-4">
              <ViewField label="Address" value={detail.businessAddress} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ViewField label="City" value={detail.city} />
                <ViewField label="Country" value={detail.country} />
                <ViewField label="Postal Code" value={detail.postalCode} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Subscription Plan Section - Matches the Card design in your code */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Subscription Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="ring-2 ring-primary bg-primary/5">
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold">
                    {detail.subscriptionPlan.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current active plan
                  </p>
                  <p className="text-lg font-bold mt-2">
                    ${detail.subscriptionPlan.price}/mo
                  </p>
                </CardContent>
              </Card>

              {/* Status Indicator */}
              <div className="md:col-span-2 flex items-center justify-center border rounded-lg bg-muted/20">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                    Status
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {detail.exchangeStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back to List
            </Button>
            {/* <Button variant="business">
              Edit Details
            </Button> */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/**
 * Reusable component to mimic the look of your form fields
 * but in "Read-Only" mode.
 */
function ViewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground opacity-70">{label}</Label>
      <div className="p-2.5 rounded-md border bg-muted/10 text-sm font-medium">
        {value || "—"}
      </div>
    </div>
  );
}
