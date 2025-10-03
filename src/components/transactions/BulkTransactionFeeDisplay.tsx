import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, Users, AlertTriangle } from "lucide-react";
import { calculateTransactionFee } from "@/utils/feeCalculator";

interface BulkTransactionFeeDisplayProps {
  bulkData: Array<{
    beneficiary: string;
    amount: number;
    country: string;
  }>;
  currency: string;
}

const BulkTransactionFeeDisplay = ({ bulkData, currency }: BulkTransactionFeeDisplayProps) => {
  if (!bulkData || bulkData.length === 0) {
    return null;
  }

  // Calculate total fee for all transactions
  const calculateTotalFee = () => {
    let totalFee = 0;
    let feeBreakdown: Array<{country: string, count: number, fee: number, type: string, responsibility: "Business" | "Beneficiary"}> = [];
    
    // Group by country
    const countryGroups = bulkData.reduce((acc, item) => {
      if (!acc[item.country]) {
        acc[item.country] = [];
      }
      acc[item.country].push(item);
      return acc;
    }, {} as Record<string, typeof bulkData>);

    // Calculate fee per country group
    Object.entries(countryGroups).forEach(([country, transactions]) => {
      const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
      const feeResult = calculateTransactionFee(
        totalAmount,
        currency,
        country,
        "Bulk Transaction",
        transactions.length
      );
      
      totalFee += feeResult.fee;
      feeBreakdown.push({
        country,
        count: transactions.length,
        fee: feeResult.fee,
        type: feeResult.feeType,
        responsibility: feeResult.feeResponsibility
      });
    });

    return { totalFee, feeBreakdown };
  };

  const { totalFee, feeBreakdown } = calculateTotalFee();
  const totalTransactionAmount = bulkData.reduce((sum, item) => sum + item.amount, 0);
  const businessFees = feeBreakdown.filter(f => f.responsibility === "Business").reduce((sum, f) => sum + f.fee, 0);
  const grandTotal = totalTransactionAmount + businessFees;

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
          <Calculator className="h-5 w-5" />
          Bulk Transaction Fee Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Beneficiaries:</span>
          </div>
          <span className="font-medium">{bulkData.length}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Transaction Amount:</span>
          <span className="font-medium">{currency} {totalTransactionAmount.toLocaleString()}</span>
        </div>

        {/* Fee breakdown by country */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Fee Breakdown by Country:</span>
          {feeBreakdown.map((breakdown, index) => (
            <div key={index} className="flex items-center justify-between text-sm bg-white/70 p-2 rounded">
              <div className="flex items-center gap-2">
                <span className="font-medium">{breakdown.country}</span>
                <Badge variant="outline" className="text-xs">
                  {breakdown.count} beneficiaries
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {breakdown.type === "Flat" ? (
                    <DollarSign className="h-3 w-3 mr-1" />
                  ) : (
                    "% "
                  )}
                  {breakdown.type}
                </Badge>
                <Badge variant={breakdown.responsibility === "Business" ? "default" : "secondary"} className="text-xs">
                  {breakdown.responsibility}
                </Badge>
              </div>
              <span className="font-medium text-orange-700">
                {currency} {breakdown.fee.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total Processing Fees:</span>
          </div>
          <span className="font-medium text-orange-700">{currency} {totalFee.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Grand Total (Amount + Business Fees):</span>
            <span className="text-primary">{currency} {grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {totalFee > 0 && (
          <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-100 p-2 rounded">
            <AlertTriangle className="h-4 w-4" />
            <span>
              Business fees will be deducted from your account. Beneficiary fees will be deducted from payout amounts.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkTransactionFeeDisplay;