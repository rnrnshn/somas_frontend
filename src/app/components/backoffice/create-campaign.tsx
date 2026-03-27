import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@/lib/router";
import { useCampaignCatalogs } from "@/features/catalogs/hooks/use-catalog-queries";
import { useCampaignQuery } from "@/features/campaigns/hooks/use-campaign-queries";
import {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useValidateCampaignBeneficiariesUploadMutation,
} from "@/features/campaigns/hooks/use-campaign-mutations";
import { importCampaignBeneficiaries } from "@/features/campaigns/api/campaigns-api";
import { HttpError } from "@/lib/api/http-error";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Check
} from "lucide-react";

type CampaignFormData = {
  name: string;
  program: string;
  region: string;
  startDate: string;
  endDate: string;
  description: string;
  enableSavings: boolean;
  beneficiaries: BeneficiaryRow[];
  paymentChannel: string;
  disbursementType: string;
  executionDate: string;
  stagedDisbursement: boolean;
};

type BeneficiaryRow = {
  id: string;
  name: string;
  msisdn: string;
  location: string;
  amount: number;
  status: "valid" | "duplicate" | "invalid";
};

export function CreateCampaign() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const campaignId = Number(id);
  const isEditMode = Number.isFinite(campaignId);
  const catalogs = useCampaignCatalogs();
  const campaignQuery = useCampaignQuery(campaignId);
  const createCampaignMutation = useCreateCampaignMutation();
  const updateCampaignMutation = useUpdateCampaignMutation(campaignId);
  const validateUploadMutation = useValidateCampaignBeneficiariesUploadMutation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    program: "",
    region: "",
    startDate: "",
    endDate: "",
    description: "",
    enableSavings: false,
    beneficiaries: [],
    paymentChannel: "",
    disbursementType: "",
    executionDate: "",
    stagedDisbursement: false,
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!campaignQuery.data) return;

    setFormData((current) => ({
      ...current,
      name: campaignQuery.data?.name ?? current.name,
      program: campaignQuery.data.programRelation?.id ? String(campaignQuery.data.programRelation.id) : current.program,
      region: campaignQuery.data.regionRelation?.id ? String(campaignQuery.data.regionRelation.id) : current.region,
      startDate: campaignQuery.data.startDate ?? current.startDate,
      endDate: campaignQuery.data.endDate ?? current.endDate,
      description: campaignQuery.data.description ?? '',
      enableSavings: campaignQuery.data.isSavingCampaignEnabled,
      paymentChannel: campaignQuery.data.paymentChannel?.id ? String(campaignQuery.data.paymentChannel.id) : current.paymentChannel,
      disbursementType: campaignQuery.data.disbursementType?.id ? String(campaignQuery.data.disbursementType.id) : current.disbursementType,
      executionDate: campaignQuery.data.executionDate ?? '',
    }));
  }, [campaignQuery.data]);

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setSubmitError(null);
      try {
        const preview = await validateUploadMutation.mutateAsync(file);
        setFormData((current) => ({
          ...current,
          beneficiaries: preview.rows.map((row) => ({
            id: String(row.index),
            name: row.name,
            msisdn: row.msisdn,
            location: row.location ?? ([row.community, row.district, row.province].filter(Boolean).join(', ') || '—'),
            amount: row.disbursementAmount ?? 0,
            status: row.status,
          })),
        }));
      } catch (error) {
        setSubmitError(error instanceof HttpError ? error.message : 'Beneficiary file could not be validated.');
      }
    }
  };

  const getValidationSummary = () => {
    const total = formData.beneficiaries.length;
    const valid = formData.beneficiaries.filter(b => b.status === "valid").length;
    const errors = formData.beneficiaries.filter(b => b.status !== "valid").length;
    return { total, valid, errors };
  };

  const getTotalDisbursement = () => {
    return formData.beneficiaries
      .filter(b => b.status === "valid")
      .reduce((sum, b) => sum + b.amount, 0);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        programId: formData.program ? Number(formData.program) : null,
        regionId: formData.region ? Number(formData.region) : null,
        province: getCatalogLabel(catalogs.regions.data ?? [], formData.region) || 'Unknown',
        community: undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        executionDate: formData.executionDate || undefined,
        isSavingCampaignEnabled: formData.enableSavings,
        paymentChannelId: formData.paymentChannel ? Number(formData.paymentChannel) : null,
        disbursementTypeId: formData.disbursementType ? Number(formData.disbursementType) : null,
      };
      const savedCampaign = isEditMode
        ? await updateCampaignMutation.mutateAsync(payload)
        : await createCampaignMutation.mutateAsync(payload);
      const validRows = formData.beneficiaries.filter((row) => row.status === 'valid').map((row, index) => ({
        index,
        name: row.name,
        msisdn: row.msisdn,
        disbursementAmount: row.amount,
        location: row.location,
        status: 'valid' as const,
        errors: [],
      }));

      if (validRows.length > 0) {
        await importCampaignBeneficiaries(savedCampaign.id, validRows);
      }

      setShowConfirmDialog(false);
      navigate(`/backoffice/campaigns/${savedCampaign.id}`);
    } catch (error) {
      setSubmitError(error instanceof HttpError ? error.message : `Campaign could not be ${isEditMode ? 'updated' : 'created'}.`);
      setShowConfirmDialog(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />;
      case "duplicate":
        return <AlertTriangle className="w-4 h-4" style={{ color: "var(--warning)" }} />;
      case "invalid":
        return <XCircle className="w-4 h-4" style={{ color: "var(--error)" }} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
      valid: { variant: "success" },
      duplicate: { variant: "warning" },
      invalid: { variant: "destructive" }
    };
    return <Badge {...(variants[status] || {})}>{status}</Badge>;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/backoffice/campaigns')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
        <h1 style={{ fontSize: "var(--text-32)", fontWeight: "var(--font-weight-semi-bold)" }}>
          Create Campaign
        </h1>
        <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)", marginTop: "8px" }}>
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progressPercentage} className="h-2" />
        <div className="grid grid-cols-4 gap-4 mt-4">
          {[
            { step: 1, label: "Campaign Details" },
            { step: 2, label: "Beneficiary Upload" },
            { step: 3, label: "Disbursement Config" },
            { step: 4, label: "Review & Confirm" }
          ].map((item) => (
            <div
              key={item.step}
              className="text-center"
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{
                  backgroundColor: currentStep >= item.step ? "var(--primary)" : "var(--muted)",
                  color: currentStep >= item.step ? "var(--primary-foreground)" : "var(--muted-foreground)"
                }}
              >
                {currentStep > item.step ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                    {item.step}
                  </span>
                )}
              </div>
              <p style={{ 
                fontSize: "var(--text-12)", 
                color: currentStep >= item.step ? "var(--foreground)" : "var(--muted-foreground)",
                fontWeight: currentStep === item.step ? "var(--font-weight-medium)" : "var(--font-weight-regular)"
              }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Campaign Details */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "var(--text-20)" }}>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {catalogs.error || submitError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  {submitError ?? (catalogs.error instanceof Error ? catalogs.error.message : campaignQuery.error instanceof Error ? campaignQuery.error.message : 'Campaign catalogs could not be loaded.')}
                </AlertDescription>
              </Alert>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Flood Relief 2024"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="program">Program Name *</Label>
                <Select value={formData.program} onValueChange={(value) => setFormData({ ...formData, program: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {(catalogs.programs.data ?? []).map((option) => (
                      <SelectItem key={option.id} value={String(option.id)}>{option.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region *</Label>
                <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {(catalogs.regions.data ?? []).map((option) => (
                      <SelectItem key={option.id} value={String(option.id)}>{option.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide additional campaign details..."
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-[--radius]" style={{ borderColor: "var(--border)" }}>
              <div>
                <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                  Enable Savings Campaign
                </p>
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                  Allow beneficiaries to participate in savings initiatives
                </p>
              </div>
              <Switch
                checked={formData.enableSavings}
                onCheckedChange={(checked) => setFormData({ ...formData, enableSavings: checked })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Beneficiary Upload */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "var(--text-20)" }}>Beneficiary Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div
              className="border-2 border-dashed rounded-[--radius] p-12 text-center cursor-pointer hover:border-primary transition-colors"
              style={{ borderColor: "var(--border)" }}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--muted-foreground)" }} />
              <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)", marginBottom: "8px" }}>
                {uploadedFile ? uploadedFile.name : "Drop your file here or click to upload"}
              </p>
              <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                Supported formats: CSV, Excel (XLSX)
              </p>
              <input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {formData.beneficiaries.length > 0 && (
              <>
                {/* Validation Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>Total Records</p>
                      <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)", marginTop: "4px" }}>
                        {getValidationSummary().total}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>Valid Records</p>
                      <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)", marginTop: "4px", color: "var(--success)" }}>
                        {getValidationSummary().valid}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>Errors Detected</p>
                      <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)", marginTop: "4px", color: "var(--error)" }}>
                        {getValidationSummary().errors}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Errors Alert */}
                {getValidationSummary().errors > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription style={{ fontSize: "var(--text-13)" }}>
                      <p style={{ fontWeight: "var(--font-weight-medium)" }}>
                        {getValidationSummary().errors} errors detected
                      </p>
                      <p style={{ color: "var(--muted-foreground)", marginTop: "4px" }}>
                        Please review and fix duplicate or invalid entries before proceeding
                      </p>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Preview Table */}
                <div>
                  <h3 style={{ fontSize: "var(--text-16)", fontWeight: "var(--font-weight-medium)", marginBottom: "12px" }}>
                    Preview
                  </h3>
                  <div className="border rounded-[--radius]" style={{ borderColor: "var(--border)" }}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>MSISDN</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.beneficiaries.map((beneficiary) => (
                          <TableRow key={beneficiary.id}>
                            <TableCell style={{ fontSize: "var(--text-13)" }}>
                              {beneficiary.name}
                            </TableCell>
                            <TableCell style={{ fontSize: "var(--text-13)", fontFamily: "var(--font-mono)" }}>
                              {beneficiary.msisdn}
                            </TableCell>
                            <TableCell style={{ fontSize: "var(--text-13)", color: "var(--muted-foreground)" }}>
                              {beneficiary.location}
                            </TableCell>
                            <TableCell style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                              ${beneficiary.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(beneficiary.status)}
                                {getStatusBadge(beneficiary.status)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Disbursement Configuration */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "var(--text-20)" }}>Disbursement Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Payment Channel *</Label>
              <Select value={formData.paymentChannel} onValueChange={(value) => setFormData({ ...formData, paymentChannel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {(catalogs.paymentChannels.data ?? []).map((option) => (
                      <SelectItem key={option.id} value={String(option.id)}>{option.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label>Disbursement Type *</Label>
              <Select value={formData.disbursementType} onValueChange={(value) => setFormData({ ...formData, disbursementType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select disbursement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(catalogs.disbursementTypes.data ?? []).map((option) => (
                      <SelectItem key={option.id} value={String(option.id)}>{option.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="executionDate">Execution Date *</Label>
              <Input
                id="executionDate"
                type="date"
                value={formData.executionDate}
                onChange={(e) => setFormData({ ...formData, executionDate: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-[--radius]" style={{ borderColor: "var(--border)" }}>
              <div>
                <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                  Enable Staged Disbursement
                </p>
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                  Disburse payments in multiple phases over time
                </p>
              </div>
              <Switch
                checked={formData.stagedDisbursement}
                onCheckedChange={(checked) => setFormData({ ...formData, stagedDisbursement: checked })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Confirmation */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "var(--text-20)" }}>Review & Confirm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                  Campaign Name
                </p>
                <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                  {formData.name || "—"}
                </p>
              </div>

              <div>
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                  Program
                </p>
                <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                  {getCatalogLabel(catalogs.programs.data ?? [], formData.program) || "—"}
                </p>
              </div>

              <div>
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                  Region
                </p>
                <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                  {getCatalogLabel(catalogs.regions.data ?? [], formData.region) || "—"}
                </p>
              </div>

              <div>
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                  Payment Channel
                </p>
                <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                  {getCatalogLabel(catalogs.paymentChannels.data ?? [], formData.paymentChannel) || "—"}
                </p>
              </div>

              <div>
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                  Total Beneficiaries
                </p>
                <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                  {getValidationSummary().valid.toLocaleString()}
                </p>
              </div>

              <div>
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                  Total Disbursement Amount
                </p>
                <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                  ${getTotalDisbursement().toLocaleString()}
                </p>
              </div>

              <div>
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                  Execution Date
                </p>
                <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                  {formData.executionDate || "—"}
                </p>
              </div>

              <div>
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                  Savings Enabled
                </p>
                <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                  {formData.enableSavings ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button onClick={handleNext}>
          {currentStep === totalSteps ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Create Campaign
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "var(--text-20)" }}>
              Confirm Campaign Creation
            </DialogTitle>
            <DialogDescription style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
              Are you sure you want to create this campaign? This action will initialize the disbursement process.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription style={{ fontSize: "var(--text-13)" }}>
                <p style={{ fontWeight: "var(--font-weight-medium)" }}>
                  {getValidationSummary().valid} beneficiaries • ${getTotalDisbursement().toLocaleString()} total
                </p>
                <p style={{ color: "var(--muted-foreground)", marginTop: "4px" }}>
                  Campaign will be activated on {formData.executionDate}
                </p>
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button disabled={createCampaignMutation.isPending || updateCampaignMutation.isPending} onClick={() => void handleCreateCampaign()}>
              Confirm & Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getCatalogLabel(options: Array<{ id: number; name: string }>, value: string) {
  if (!value) return '';
  return options.find((option) => String(option.id) === value)?.name ?? '';
}
