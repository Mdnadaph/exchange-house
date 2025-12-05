import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileText, CreditCard, BookOpen, Building } from "lucide-react";

export interface IDDocument {
  id: string;
  documentType: string;
  documentTypeCode: string;
  documentNumber: string;
  issuingCountry: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority?: string;
}

interface IDDocumentFormProps {
  documents: IDDocument[];
  onChange: (documents: IDDocument[]) => void;
  showHeader?: boolean;
}

const documentTypes = [
  { label: "Passport", value: "passport", code: "1", icon: BookOpen },
  { label: "Trade License", value: "trade_license", code: "2", icon: Building },
  { label: "Emirates ID", value: "emirates_id", code: "3", icon: CreditCard },
  { label: "National ID", value: "national_id", code: "4", icon: CreditCard },
  { label: "Driver's License", value: "drivers_license", code: "5", icon: FileText },
  { label: "Company Registration", value: "company_registration", code: "6", icon: Building },
  { label: "Tax Registration", value: "tax_registration", code: "7", icon: FileText },
  { label: "Memorandum of Association", value: "moa", code: "8", icon: FileText },
];

const countries = [
  "United Arab Emirates", "India", "Pakistan", "Philippines", "Bangladesh", 
  "Sri Lanka", "Nepal", "Egypt", "Jordan", "United Kingdom", "United States",
  "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"
];

const IDDocumentForm = ({ documents, onChange, showHeader = true }: IDDocumentFormProps) => {
  const addDocument = () => {
    const newDoc: IDDocument = {
      id: `doc_${Date.now()}`,
      documentType: "",
      documentTypeCode: "",
      documentNumber: "",
      issuingCountry: "",
      issueDate: "",
      expiryDate: "",
      issuingAuthority: ""
    };
    onChange([...documents, newDoc]);
  };

  const removeDocument = (id: string) => {
    onChange(documents.filter(doc => doc.id !== id));
  };

  const updateDocument = (id: string, field: keyof IDDocument, value: string) => {
    onChange(documents.map(doc => {
      if (doc.id === id) {
        if (field === "documentType") {
          const docType = documentTypes.find(dt => dt.value === value);
          return { ...doc, [field]: value, documentTypeCode: docType?.code || "" };
        }
        return { ...doc, [field]: value };
      }
      return doc;
    }));
  };

  const getDocumentIcon = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type);
    const Icon = docType?.icon || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const isValidDocument = (doc: IDDocument) => {
    return doc.documentType && doc.documentNumber && doc.issuingCountry && doc.issueDate && doc.expiryDate;
  };

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Identity Documents</h3>
            <p className="text-sm text-muted-foreground">
              Add required identification documents (Passport + Trade License minimum for business)
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={addDocument}>
            <Plus className="h-4 w-4 mr-1" />
            Add Document
          </Button>
        </div>
      )}

      {documents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              No documents added yet. Add identification documents to proceed.
            </p>
            <Button variant="outline" onClick={addDocument}>
              <Plus className="h-4 w-4 mr-1" />
              Add First Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <Card key={doc.id} className={`transition-all ${isValidDocument(doc) ? 'border-success/50 bg-success/5' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {getDocumentIcon(doc.documentType)}
                    Document {index + 1}
                    {doc.documentType && (
                      <Badge variant="secondary" className="text-xs">
                        {documentTypes.find(dt => dt.value === doc.documentType)?.label}
                      </Badge>
                    )}
                    {doc.documentTypeCode && (
                      <Badge variant="outline" className="text-xs">
                        Code: {doc.documentTypeCode}
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(doc.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Document Type *</Label>
                    <Select 
                      value={doc.documentType} 
                      onValueChange={(value) => updateDocument(doc.id, "documentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        {documentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label} (Code: {type.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Document Number *</Label>
                    <Input
                      value={doc.documentNumber}
                      onChange={(e) => updateDocument(doc.id, "documentNumber", e.target.value)}
                      placeholder="Enter document number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Issuing Country *</Label>
                    <Select 
                      value={doc.issuingCountry} 
                      onValueChange={(value) => updateDocument(doc.id, "issuingCountry", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Authority</Label>
                    <Input
                      value={doc.issuingAuthority || ""}
                      onChange={(e) => updateDocument(doc.id, "issuingAuthority", e.target.value)}
                      placeholder="e.g., DED Dubai, ICA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Issue Date *</Label>
                    <Input
                      type="date"
                      value={doc.issueDate}
                      onChange={(e) => updateDocument(doc.id, "issueDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date *</Label>
                    <Input
                      type="date"
                      value={doc.expiryDate}
                      onChange={(e) => updateDocument(doc.id, "expiryDate", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {documents.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={addDocument}>
            <Plus className="h-4 w-4 mr-1" />
            Add Another Document
          </Button>
        </div>
      )}
    </div>
  );
};

export default IDDocumentForm;
