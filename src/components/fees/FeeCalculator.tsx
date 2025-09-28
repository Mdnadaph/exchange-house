import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, Percent } from "lucide-react";

interface FeeRule {
  transactionType: "Single Transaction" | "Bulk Transaction";
  country: string;
  minAmount: number;
  maxAmount: number;
  feeType: "Flat" | "BPS";
  feeValue: number; // For Flat: AED amount, For BPS: basis points (e.g., 50 = 0.5%)
}

interface FeeCalculatorProps {
  amount: number;
  currency: string;
  country: string;
  transactionType: "Single Transaction" | "Bulk Transaction";
  beneficiaryCount?: number; // For bulk transactions
}

const FeeCalculator = ({ 
  amount, 
  currency, 
  country, 
  transactionType,
  beneficiaryCount = 1 
}: FeeCalculatorProps) => {
  // Mock fee rules - in real app, this would come from API
  const feeRules: FeeRule[] = [
    {
      transactionType: "Single Transaction",
      country: "India",
      minAmount: 0,
      maxAmount: 10000,
      feeType: "Flat",
      feeValue: 25
    },
    {
      transactionType: "Single Transaction", 
      country: "India",
      minAmount: 10001,
      maxAmount: 50000,
      feeType: "BPS",
      feeValue: 50 // 0.5%
    },
    {
      transactionType: "Bulk Transaction",
      country: "India",
      minAmount: 0,
      maxAmount: 999999,
      feeType: "Flat",
      feeValue: 15 // per beneficiary
    },
    {
      transactionType: "Single Transaction",
      country: "Philippines",
      minAmount: 0,
      maxAmount: 25000,
      feeType: "Flat",
      feeValue: 30
    },
    {
      transactionType: "Single Transaction",
      country: "Bangladesh",
      minAmount: 0,
      maxAmount: 999999,
      feeType: "BPS",
      feeValue: 75 // 0.75%
    }
  ];

  const calculateFee = (): { fee: number; feeType: string; description: string } => {
    // Find applicable fee rule
    const applicableRule = feeRules.find(rule => 
      rule.transactionType === transactionType &&
      rule.country === country &&
      amount >= rule.minAmount &&
      amount <= rule.maxAmount
    );

    if (!applicableRule) {
      return { fee: 0, feeType: "N/A", description: "No applicable fee rule found" };
    }

    let calculatedFee = 0;
    let description = "";

    if (applicableRule.feeType === "Flat") {
      if (transactionType === "Bulk Transaction") {
        calculatedFee = applicableRule.feeValue * beneficiaryCount;
        description = `${currency} ${applicableRule.feeValue} × ${beneficiaryCount} beneficiaries`;
      } else {
        calculatedFee = applicableRule.feeValue;
        description = `${currency} ${applicableRule.feeValue} flat fee`;
      }
    } else if (applicableRule.feeType === "BPS") {
      const percentage = applicableRule.feeValue / 10000; // Convert basis points to decimal
      calculatedFee = amount * percentage;
      description = `${applicableRule.feeValue} BPS (${(percentage * 100).toFixed(2)}%) of transaction amount`;
    }

    return {
      fee: calculatedFee,
      feeType: applicableRule.feeType,
      description
    };
  };

  const { fee, feeType, description } = calculateFee();
  const totalAmount = amount + fee;

  if (fee === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
          <Calculator className="h-5 w-5" />
          Transaction Fee Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Transaction Amount:</span>
          <span className="font-medium">{currency} {amount.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Processing Fee:</span>
            <Badge variant="outline" className="text-xs">
              {feeType === "Flat" ? (
                <DollarSign className="h-3 w-3 mr-1" />
              ) : (
                <Percent className="h-3 w-3 mr-1" />
              )}
              {feeType}
            </Badge>
          </div>
          <span className="font-medium text-orange-700">{currency} {fee.toFixed(2)}</span>
        </div>
        
        <div className="text-xs text-muted-foreground italic">
          {description}
        </div>
        
        <div className="border-t pt-3">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total Cost:</span>
            <span className="text-primary">{currency} {totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeCalculator;