import ExchangeLayout from "@/components/layout/ExchangeLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import ExchangeAdminUser from "./ExchangeAdminUser";
import ExchangeStaffManagement from "./ExchangeStaffManagement";

export default function ExchangeAdminMember() {
  const [activeTab, setActiveTab] = useState<"staffMember" | "exchangeMember">(
    "staffMember",
  );

  return (
    <ExchangeLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Members</h1>
            <p className="text-muted-foreground">
              Manage members and workload distribution
            </p>
          </div>
        </div>
        <div>
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as "staffMember" | "exchangeMember");
            }}
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger
                value="staffMember"
                className="flex items-center gap-2"
              >
                Staff Memeber
              </TabsTrigger>
              <TabsTrigger
                value="exchangeMember"
                className="flex items-center gap-2"
              >
                Exchange Memeber
              </TabsTrigger>
            </TabsList>
            <TabsContent value="staffMember" className="mt-6">
              <ExchangeStaffManagement />
            </TabsContent>
            <TabsContent value="exchangeMember" className="mt-6 space-y-6">
              <ExchangeAdminUser />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ExchangeLayout>
  );
}
