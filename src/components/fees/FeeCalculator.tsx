import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, Percent } from "lucide-react";
import { calculateTransactionFee } from "@/utils/feeCalculator";

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
  beneficiaryCount = 1,
}: FeeCalculatorProps) => {
  const { fee, feeType, description, feeResponsibility } =
    calculateTransactionFee(
      amount,
      currency,
      country,
      transactionType,
      beneficiaryCount,
    );
  const totalAmount = feeResponsibility === "Business" ? amount + fee : amount;

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
          <span className="text-sm text-muted-foreground">
            Transaction Amount:
          </span>
          <span className="font-medium">
            {/*{currency}*/}
            {amount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Processing Fee:
            </span>
            <Badge variant="outline" className="text-xs">
              {feeType === "Flat" ? (
                <DollarSign className="h-3 w-3 mr-1" />
              ) : (
                <Percent className="h-3 w-3 mr-1" />
              )}
              {feeType}
            </Badge>
          </div>
          <span className="font-medium text-orange-700">
            {/*{currency}*/}
            {fee.toFixed(2)}
          </span>
        </div>

        <div className="text-xs text-muted-foreground italic">
          {description}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Fee paid by:</span>
          <Badge
            variant={feeResponsibility === "Business" ? "default" : "secondary"}
          >
            {feeResponsibility}
          </Badge>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>
              {feeResponsibility === "Business"
                ? "Total Cost:"
                : "Transaction Amount:"}
            </span>
            <span className="text-primary">
              {/*{currency}*/}
              {totalAmount.toFixed(2)}
            </span>
          </div>
          {feeResponsibility === "Beneficiary" && (
            <p className="text-xs text-muted-foreground mt-1">
              Beneficiary will receive
              {/*{currency}*/}
              {(amount - fee).toFixed(2)} after fee deduction
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeCalculator;
