interface FeeRule {
  transactionType: "Single Transaction" | "Bulk Transaction";
  country: string;
  minAmount: number;
  maxAmount: number;
  feeType: "Flat" | "BPS";
  feeValue: number; // For Flat: AED amount, For BPS: basis points (e.g., 50 = 0.5%)
}

// Mock fee rules - in real app, this would come from API/database
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
  },
  {
    transactionType: "Single Transaction",
    country: "Pakistan",
    minAmount: 0,
    maxAmount: 15000,
    feeType: "Flat",
    feeValue: 20
  },
  {
    transactionType: "Single Transaction",
    country: "Nepal",
    minAmount: 0,
    maxAmount: 999999,
    feeType: "BPS",
    feeValue: 60 // 0.6%
  }
];

export interface FeeCalculationResult {
  fee: number;
  feeType: string;
  description: string;
}

export const calculateTransactionFee = (
  amount: number,
  currency: string,
  country: string,
  transactionType: "Single Transaction" | "Bulk Transaction",
  beneficiaryCount: number = 1
): FeeCalculationResult => {
  // Find applicable fee rule
  const applicableRule = feeRules.find(rule => 
    rule.transactionType === transactionType &&
    rule.country === country &&
    amount >= rule.minAmount &&
    amount <= rule.maxAmount
  );

  if (!applicableRule) {
    return { 
      fee: 0, 
      feeType: "N/A", 
      description: "No applicable fee rule found" 
    };
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

export const getFeeRules = (): FeeRule[] => {
  return feeRules;
};

export const getFeeRulesByCountry = (country: string): FeeRule[] => {
  return feeRules.filter(rule => rule.country === country);
};