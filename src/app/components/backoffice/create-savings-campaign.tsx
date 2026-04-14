import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@/lib/router";
import { useCampaignsQuery } from "@/features/campaigns/hooks/use-campaign-queries";
import {
  useCreateSavingsProgramMutation,
  useSavingsProgramQuery,
  useUpdateSavingsProgramMutation} from "@/features/savings-programs/hooks/use-savings-program-queries";
import { HttpError } from "@/lib/api/http-error";
import { formatMetical } from "@/lib/format/currency";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle} from "../ui/dialog";
import { ArrowLeft, Check, Info } from "lucide-react";
import { toast } from "sonner";

type SavingsCampaignFormData = {
  name: string;
  linkedCampaign: string;
  startDate: string;
  endDate: string;
  savingsGoal: string;
  minimumContribution: string;
  matchingBonus: string;
  enableMatchingBonus: boolean;
  description: string;
};

export function CreateSavingsCampaign() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const savingsProgramId = Number(id);
  const isEditMode = Number.isFinite(savingsProgramId);
  const campaignsQuery = useCampaignsQuery({ page: 1, pageSize: 100 });
  const savingsProgramQuery = useSavingsProgramQuery(savingsProgramId);
  const createMutation = useCreateSavingsProgramMutation();
  const updateMutation = useUpdateSavingsProgramMutation(savingsProgramId);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SavingsCampaignFormData>({
    name: "",
    linkedCampaign: "",
    startDate: "",
    endDate: "",
    savingsGoal: "",
    minimumContribution: "",
    matchingBonus: "",
    enableMatchingBonus: false,
    description: ""});

  useEffect(() => {
    if (!savingsProgramQuery.data) return;
    setFormData({
      name: savingsProgramQuery.data.name,
      linkedCampaign: String(savingsProgramQuery.data.campaignId),
      startDate: savingsProgramQuery.data.startDate,
      endDate: savingsProgramQuery.data.endDate,
      savingsGoal: String(savingsProgramQuery.data.savingsGoal),
      minimumContribution: String(savingsProgramQuery.data.minimumContribution),
      matchingBonus: String(savingsProgramQuery.data.matchingBonusPercentage ?? ''),
      enableMatchingBonus: savingsProgramQuery.data.matchingBonusEnabled,
      description: savingsProgramQuery.data.description ?? ''});
  }, [savingsProgramQuery.data]);

  const validateForm = () => {
    if (!formData.name.trim()) return 'Enter a savings campaign name.';
    if (!formData.linkedCampaign) return 'Select a linked campaign.';
    if (!Number.isFinite(Number(formData.linkedCampaign)) || Number(formData.linkedCampaign) <= 0) {
      return 'Select a valid linked campaign.';
    }
    if (!formData.startDate) return 'Select a start date.';
    if (!formData.endDate) return 'Select an end date.';
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return 'End date must be after the start date.';
    }

    const savingsGoal = Number(formData.savingsGoal);
    if (!Number.isFinite(savingsGoal) || savingsGoal <= 0) {
      return 'Enter a savings goal greater than zero.';
    }

    const minimumContribution = Number(formData.minimumContribution);
    if (!Number.isFinite(minimumContribution) || minimumContribution < 0) {
      return 'Enter a valid minimum contribution.';
    }

    if (formData.enableMatchingBonus) {
      const matchingBonus = Number(formData.matchingBonus);
      if (!Number.isFinite(matchingBonus) || matchingBonus < 0 || matchingBonus > 100) {
        return 'Enter a matching bonus percentage between 0 and 100.';
      }
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    setSubmitError(validationError);
    if (validationError) return;
    setShowConfirmDialog(true);
  };

  const handleCreateCampaign = async () => {
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      setShowConfirmDialog(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        campaignId: Number(formData.linkedCampaign),
        startDate: formData.startDate,
        endDate: formData.endDate,
        savingsGoal: Number(formData.savingsGoal),
        minimumContribution: Number(formData.minimumContribution),
        matchingBonusEnabled: formData.enableMatchingBonus,
        matchingBonusPercentage: formData.enableMatchingBonus ? Number(formData.matchingBonus || 0) : 0,
        description: formData.description || undefined};
      const result = isEditMode
        ? await updateMutation.mutateAsync(payload)
        : await createMutation.mutateAsync(payload);
      toast.success(isEditMode ? 'Savings campaign updated successfully.' : 'Savings campaign created successfully.');
      setShowConfirmDialog(false);
      navigate(`/backoffice/savings/${result.id}`);
    } catch (error) {
      toast.error(error instanceof HttpError ? error.message : `Savings campaign could not be ${isEditMode ? 'updated' : 'created'}.`);
      setSubmitError(error instanceof HttpError ? error.message : `Savings campaign could not be ${isEditMode ? 'updated' : 'created'}.`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/backoffice/savings')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Savings Campaigns
        </Button>
        <h1 style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
          {isEditMode ? 'Edit Savings Campaign' : 'Create Savings Campaign'}
        </h1>
        <p style={{  color: "var(--muted-foreground)", marginTop: "8px" }}>
          {isEditMode ? 'Update the savings program linked to a social transfer campaign' : 'Set up a new savings program linked to a social transfer campaign'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {savingsProgramQuery.error ? (
              <Alert variant="destructive">
                <AlertDescription>
                  {savingsProgramQuery.error instanceof Error ? savingsProgramQuery.error.message : 'Savings program could not be loaded.'}
                </AlertDescription>
              </Alert>
            ) : null}
            {/* Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={"e.g., Flood Relief Savings 2024"}
                required
              />
            </div>

            {/* Linked Campaign */}
            <div className="space-y-2">
              <Label htmlFor="linkedCampaign">Linked Campaign *</Label>
              <Select 
                value={formData.linkedCampaign} 
                onValueChange={(value) => setFormData({ ...formData, linkedCampaign: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={"Select a campaign"} />
                </SelectTrigger>
                <SelectContent>
                  {(campaignsQuery.data?.data ?? []).map((campaign) => (
                    <SelectItem key={campaign.id} value={String(campaign.id)}>{campaign.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p style={{  color: "var(--muted-foreground)" }}>
                Select the campaign that this savings program will be linked to
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Savings Goal */}
            <div className="space-y-2">
              <Label htmlFor="savingsGoal">Savings Goal *</Label>
              <div className="relative">
                <span 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                  style={{  color: "var(--muted-foreground)" }}
                >
                  MZN
                </span>
                <Input
                  id="savingsGoal"
                  type="number"
                  value={formData.savingsGoal}
                  onChange={(e) => setFormData({ ...formData, savingsGoal: e.target.value })}
                  placeholder={"0.00"}
                  className="pl-7"
                  required
                />
              </div>
              <p style={{  color: "var(--muted-foreground)" }}>
                Total target amount for this savings campaign
              </p>
            </div>

            {/* Minimum Contribution */}
            <div className="space-y-2">
              <Label htmlFor="minimumContribution">Minimum Contribution *</Label>
              <div className="relative">
                <span 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                  style={{  color: "var(--muted-foreground)" }}
                >
                  MZN
                </span>
                <Input
                  id="minimumContribution"
                  type="number"
                  value={formData.minimumContribution}
                  onChange={(e) => setFormData({ ...formData, minimumContribution: e.target.value })}
                  placeholder={"0.00"}
                  className="pl-7"
                  required
                />
              </div>
              <p style={{  color: "var(--muted-foreground)" }}>
                Minimum amount beneficiaries can save per deposit
              </p>
            </div>

            {/* Matching Bonus Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-[var(--radius)]" style={{ borderColor: "var(--border)" }}>
              <div>
                <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                  Enable Matching Bonus
                </p>
                <p style={{  color: "var(--muted-foreground)" }}>
                  Provide additional incentive by matching a percentage of savings
                </p>
              </div>
              <Switch
                checked={formData.enableMatchingBonus}
                onCheckedChange={(checked) => setFormData({ ...formData, enableMatchingBonus: checked })}
              />
            </div>

            {/* Matching Bonus Percentage */}
            {formData.enableMatchingBonus && (
              <div className="space-y-2">
                <Label htmlFor="matchingBonus">Matching Bonus Percentage</Label>
                <div className="relative">
                  <Input
                    id="matchingBonus"
                    type="number"
                    value={formData.matchingBonus}
                    onChange={(e) => setFormData({ ...formData, matchingBonus: e.target.value })}
                    placeholder={"0"}
                    min="0"
                    max="100"
                  />
                  <span 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2" 
                    style={{  color: "var(--muted-foreground)" }}
                  >
                    %
                  </span>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    For example, a 50% matching bonus means if a beneficiary saves MZN 10, they will receive an additional MZN 5
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Description */}
            {submitError ? (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={"Provide additional details about this savings campaign..."}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/backoffice/savings')}
          >
            Cancel
          </Button>

          <Button disabled={createMutation.isPending || updateMutation.isPending} type="submit">
            <Check className="w-4 h-4 mr-2" />
            {isEditMode ? 'Update Savings Campaign' : 'Create Savings Campaign'}
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Confirm Savings Campaign Update' : 'Confirm Savings Campaign Creation'}
            </DialogTitle>
            <DialogDescription style={{  color: "var(--muted-foreground)" }}>
              {isEditMode ? 'Are you sure you want to update this savings campaign?' : 'Are you sure you want to create this savings campaign?'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--border)" }}>
                <span style={{  color: "var(--muted-foreground)" }}>Campaign Name</span>
                <span style={{  fontWeight: "var(--font-weight-medium)" }}>
                  {formData.name || "—"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--border)" }}>
                <span style={{  color: "var(--muted-foreground)" }}>Linked Campaign</span>
                <span style={{  fontWeight: "var(--font-weight-medium)" }}>
                  {formData.linkedCampaign || "—"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--border)" }}>
                <span style={{  color: "var(--muted-foreground)" }}>Savings Goal</span>
                <span style={{  fontWeight: "var(--font-weight-medium)" }}>
                  {formatMetical(formData.savingsGoal ? parseFloat(formData.savingsGoal) : 0)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span style={{  color: "var(--muted-foreground)" }}>Matching Bonus</span>
                <span style={{  fontWeight: "var(--font-weight-medium)" }}>
                  {formData.enableMatchingBonus ? `${formData.matchingBonus}%` : "Disabled"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button disabled={createMutation.isPending || updateMutation.isPending} onClick={() => void handleCreateCampaign()}>
              {isEditMode ? 'Confirm & Update' : 'Confirm & Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
