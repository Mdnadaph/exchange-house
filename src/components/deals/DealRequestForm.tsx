import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, TrendingUp, Info, DollarSign } from "lucide-react";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";

interface DealRequestFormProps {
  trigger?: React.ReactNode;
  onSubmitSuccess?: () => void;
  refetch?: () => any;
}

const DealRequestForm = ({
  trigger,
  onSubmitSuccess,
  refetch,
}: DealRequestFormProps) => {
  const [cookies] = useCookies(["token", "currencyCode"]);
  const token = cookies.token;
  const currencyCode = cookies.currencyCode;

  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionPurposeData, setTransactionPurpose] = useState([]);
  const [complianceCurrencies, setComplianceCurrencies] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    sendingAmount: "",
    payoutCountry: "",
    payoutCountryId: "",
    payoutCurrency: "",
    proposedRate: "",
    currentMarketRate: "",
    purpose: "",
    notes: "",
  });

  // Derive unique countries from complianceCurrencies
  const countries = Array.from(
    new Map(
      complianceCurrencies.map((item) => [item.countryCode, item]),
    ).values(),
  );

  // Derive currencies for the selected country
  const currenciesForCountry = complianceCurrencies
    .filter((item) => item.countryCode === formData.payoutCountry)
    .map((item) => item.currencyCode);

  const getTransitionPropose = async () => {
    if (!token) {
      toast({
        title: "Error",
        description: "No token found",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/rate-deals/rate-deals-purpose`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.status !== true || !json.data) {
        throw new Error("Unexpected response format");
      }
      setTransactionPurpose(json?.data);
    } catch (error) {
      const msg = error.message || "Failed to load purposes";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const getComplianceCurrencies = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/payout/config/compliance-currencies`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.status !== true || !json.data) {
        throw new Error("Unexpected response format");
      }
      setComplianceCurrencies(json.data);
    } catch (error) {
      const msg = error.message || "Failed to load compliance currencies";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const getExchangeRates = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/api/v1/exchange_rate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.status !== true || !json.data) {
        throw new Error("Unexpected response format");
      }
      setExchangeRates(json.data);
    } catch (error) {
      const msg = error.message || "Failed to load exchange rates";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  useEffect(() => {
    getTransitionPropose();
    getComplianceCurrencies();
    getExchangeRates();
  }, []);

  const handleCountryChange = (countryId: string) => {
    // Find the matching country entry to get countryCode for UI filtering
    const countryEntry = complianceCurrencies.find(
      (item) => String(item.countryId) === countryId,
    );
    // Reset currency and market rate when country changes
    setFormData({
      ...formData,
      payoutCountry: countryEntry?.countryCode ?? "",
      payoutCountryId: countryId,
      payoutCurrency: "",
      currentMarketRate: "",
    });
  };

  const handleCurrencyChange = (currency: string) => {
    // Look up market rate for selected currency from exchangeRates
    const rateEntry = exchangeRates.find(
      (r) => r.name.toLowerCase() === currency.toLowerCase(),
    );
    const marketRate = rateEntry ? String(rateEntry.rate) : "";

    setFormData({
      ...formData,
      payoutCurrency: currency,
      currentMarketRate: marketRate,
    });
  };

  const calculateSavings = () => {
    const amount = parseFloat(formData.sendingAmount);
    const proposedRate = parseFloat(formData.proposedRate);
    const marketRate = parseFloat(formData.currentMarketRate);

    if (!amount || !proposedRate || !marketRate) return null;

    const marketPayout = amount * marketRate;
    const proposedPayout = amount * proposedRate;
    const difference = proposedPayout - marketPayout;
    const percentageDiff = ((proposedRate - marketRate) / marketRate) * 100;

    return {
      marketPayout: marketPayout.toFixed(2),
      proposedPayout: proposedPayout.toFixed(2),
      difference: difference.toFixed(2),
      percentageDiff: percentageDiff.toFixed(2),
    };
  };

  const savings = calculateSavings();

  const handleSubmit = async () => {
    const formDTO = {
      sendingCurrency: currencyCode, // from cookie, read-only
      amount: formData?.sendingAmount,
      countryId: formData?.payoutCountryId,
      payoutCurrency: formData?.payoutCurrency,
      transactionPurposeId: formData?.purpose,
      currentMarketRate: formData?.currentMarketRate,
      proposedRate: formData?.proposedRate,
      notes: formData?.notes,
    };
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/rate-deals/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formDTO),
      });
      const json = await res.json();

      if (!res.ok || json.status !== true) {
        throw new Error(json.message || "Create failed");
      }

      setFormData({
        sendingAmount: "",
        payoutCountry: "",
        payoutCountryId: "",
        payoutCurrency: "",
        proposedRate: "",
        currentMarketRate: "",
        purpose: "",
        notes: "",
      });

      toast({
        title: "Deal Request Submitted",
        description:
          "Your exchange rate deal request has been submitted for review.",
      });
      setOpen(false);
      onSubmitSuccess?.();
      refetch?.();
    } catch (error) {
      toast({
        title: "Failed to Custom Rate",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (
      !formData.sendingAmount ||
      !formData.payoutCountryId ||
      !formData.payoutCurrency ||
      !formData.proposedRate ||
      !formData.purpose
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Request Custom Rate
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Request Custom Exchange Rate Deal
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Negotiate a better exchange rate for your transaction
            </p>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Info Banner */}
            <Card className="bg-accent-muted/20 border-accent">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-accent mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">How it works</p>
                    <p className="text-muted-foreground">
                      Submit your desired exchange rate. The Exchange House or
                      your Branch will review and either approve, reject, or
                      counter-propose a rate. You can accept or reject their
                      counter-offer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Transaction Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sending Currency — read-only from cookie */}
                  <div className="space-y-2">
                    <Label htmlFor="sendingCurrency">Sending Currency</Label>
                    <Input
                      id="sendingCurrency"
                      value={currencyCode || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sendingAmount">Amount to Send *</Label>
                    <Input
                      id="sendingAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={formData.sendingAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sendingAmount: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payoutCountry">Payout Country *</Label>
                    <Select
                      value={formData.payoutCountryId}
                      onValueChange={handleCountryChange}
                    >
                      <SelectTrigger id="payoutCountry">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem
                            key={country.countryId}
                            value={String(country.countryId)}
                          >
                            {country.countryName} ({country.countryCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payoutCurrency">Payout Currency *</Label>
                    <Select
                      value={formData.payoutCurrency}
                      onValueChange={handleCurrencyChange}
                      disabled={!formData.payoutCountryId}
                    >
                      <SelectTrigger id="payoutCurrency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currenciesForCountry.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Transaction Purpose *</Label>
                  <Select
                    value={formData.purpose}
                    onValueChange={(value) =>
                      setFormData({ ...formData, purpose: value })
                    }
                  >
                    <SelectTrigger id="purpose">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {transactionPurposeData?.map((transitionPurposeItem) => (
                        <SelectItem
                          key={transitionPurposeItem?.id}
                          value={transitionPurposeItem?.id}
                        >
                          {transitionPurposeItem?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Exchange Rate Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Exchange Rate Proposal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentMarketRate">
                      Current Market Rate
                    </Label>
                    <Input
                      type="number"
                      id="currentMarketRate"
                      value={formData.currentMarketRate}
                      disabled
                      className="bg-muted"
                      placeholder="Auto-filled on currency selection"
                    />
                    <p className="text-xs text-muted-foreground">
                      Standard rate offered by the exchange house
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proposedRate">Your Proposed Rate *</Label>
                    <Input
                      id="proposedRate"
                      type="number"
                      step="0.01"
                      placeholder="Enter your desired rate"
                      value={formData.proposedRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          proposedRate: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Rate you would like to negotiate
                    </p>
                  </div>
                </div>

                {/* Savings Calculation */}
                {savings && (
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Potential Impact</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Market Payout:
                          </span>
                          <p className="font-semibold">
                            {formData.payoutCurrency} {savings.marketPayout}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Proposed Payout:
                          </span>
                          <p className="font-semibold">
                            {formData.payoutCurrency} {savings.proposedPayout}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Difference:
                          </span>
                          <p
                            className={`font-semibold ${parseFloat(savings.difference) >= 0 ? "text-success" : "text-destructive"}`}
                          >
                            {parseFloat(savings.difference) >= 0 ? "+" : ""}
                            {formData.payoutCurrency} {savings.difference}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Rate Change:
                          </span>
                          <p
                            className={`font-semibold ${parseFloat(savings.percentageDiff) >= 0 ? "text-success" : "text-destructive"}`}
                          >
                            {parseFloat(savings.percentageDiff) >= 0 ? "+" : ""}
                            {savings.percentageDiff}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information to support your request..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleConfirm}
                disabled={loading}
              >
                Submit Deal Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isConfirming={loading}
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleSubmit}
        title="Confirm Deal Request"
        description={`Submit request for ${currencyCode} ${formData.sendingAmount} at rate ${formData.proposedRate} to ${formData.payoutCurrency}? This will be reviewed by the Exchange House.`}
        confirmText="Submit Request"
      />
    </>
  );
};

export default DealRequestForm;
