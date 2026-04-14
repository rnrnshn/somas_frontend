import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@/lib/router";
import { useBeneficiaryDetailQueries } from "@/features/beneficiaries/hooks/use-beneficiary-queries";
import { useUpdateBeneficiaryMutation } from "@/features/beneficiaries/hooks/use-beneficiary-mutations";
import { useCampaignCatalogs, useDistrictCatalog } from "@/features/catalogs/hooks/use-catalog-queries";
import { HttpError } from "@/lib/api/http-error";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function BeneficiaryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const beneficiaryId = Number(id);
  const isEdit = Number.isFinite(beneficiaryId);
  const queries = useBeneficiaryDetailQueries(beneficiaryId);
  const catalogs = useCampaignCatalogs();
  const updateMutation = useUpdateBeneficiaryMutation(beneficiaryId);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    provinceId: "",
    districtId: "",
    community: "",
    notes: ""});

  const selectedProvinceId = Number(formData.provinceId);
  const districts = useDistrictCatalog(
    Number.isFinite(selectedProvinceId) && selectedProvinceId > 0 ? selectedProvinceId : undefined
  );

  useEffect(() => {
    if (!isEdit) {
      toast.info('Standalone beneficiary creation is not available here. Add beneficiaries from a campaign instead.');
      navigate('/backoffice/beneficiaries');
      return;
    }

    const profile = queries.profile.data;
    if (!profile) return;
    setFormData({
      fullName: profile.name,
      phone: profile.msisdn,
      email: profile.email ?? '',
      provinceId: getCatalogId(profile.province, profile.provinceId),
      districtId: getCatalogId(profile.district, profile.districtId),
      community: profile.community ?? '',
      notes: profile.notes ?? ''});
  }, [isEdit, navigate, queries.profile.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    void updateMutation.mutateAsync({
        name: formData.fullName,
        msisdn: formData.phone,
        email: formData.email || null,
        provinceId: formData.provinceId ? Number(formData.provinceId) : null,
        districtId: formData.districtId ? Number(formData.districtId) : null,
        community: formData.community || null,
        notes: formData.notes || null})
      .then((beneficiary) => {
        toast.success('Beneficiary updated successfully.');
        navigate(`/backoffice/beneficiaries/profile/${beneficiary.id}`);
      })
      .catch((error) => {
        toast.error(error instanceof HttpError ? error.message : 'Beneficiary could not be updated.');
        setSubmitError(error instanceof HttpError ? error.message : 'Beneficiary could not be updated.');
      });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/backoffice/beneficiaries")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Beneficiaries
        </Button>
        <h1 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
          {isEdit ? "Edit Beneficiary" : "Create New Beneficiary"}
        </h1>
        <p style={{  color: 'var(--muted-foreground)', marginTop: '8px' }}>
          {isEdit ? "Update beneficiary information" : "Add a new beneficiary to the system"}
        </p>
        {isEdit && queries.profile.isPending ? (
          <p style={{  color: 'var(--muted-foreground)', marginTop: '8px' }}>Loading beneficiary...</p>
        ) : null}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
              Beneficiary Information
            </h3>
            <p style={{  color: 'var(--muted-foreground)' }}>
              Enter the required information for the beneficiary
            </p>
          </CardHeader>
          <CardContent>
            {submitError ? (
              <p style={{  color: 'var(--error)', marginBottom: '16px' }}>{submitError}</p>
            ) : null}
            <div className="grid grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="col-span-2">
                <Label htmlFor="fullName" style={{  fontWeight: 'var(--font-weight-medium)' }}>
                  Full Name <span style={{ color: 'var(--destructive)' }}>*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder={"Enter full name"}
                  required
                  className="mt-2"
                />
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone" style={{  fontWeight: 'var(--font-weight-medium)' }}>
                  Phone Number <span style={{ color: 'var(--destructive)' }}>*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder={"+63 XXX XXX XXXX"}
                  required
                  className="mt-2"
                />
                <p style={{  color: 'var(--muted-foreground)', marginTop: '4px' }}>
                  Include country code (e.g., +63 for Philippines)
                </p>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" style={{  fontWeight: 'var(--font-weight-medium)' }}>
                  Email <span style={{  color: 'var(--muted-foreground)' }}>(optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder={"email@example.com"}
                  className="mt-2"
                />
              </div>

              {/* Province */}
              <div>
                <Label htmlFor="province" style={{  fontWeight: 'var(--font-weight-medium)' }}>
                  Province <span style={{ color: 'var(--destructive)' }}>*</span>
                </Label>
                <Select
                  value={formData.provinceId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, provinceId: value, districtId: '' }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={"Select province"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(catalogs.provinces.data ?? []).map((province) => (
                      <SelectItem key={province.id} value={String(province.id)}>{province.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div>
                <Label htmlFor="district" style={{  fontWeight: 'var(--font-weight-medium)' }}>
                  District <span style={{ color: 'var(--destructive)' }}>*</span>
                </Label>
                <Select value={formData.districtId} onValueChange={(value) => handleChange("districtId", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={"Select district"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(districts.data ?? []).map((district) => (
                      <SelectItem key={district.id} value={String(district.id)}>{district.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Community */}
              <div className="col-span-2">
                <Label htmlFor="community" style={{  fontWeight: 'var(--font-weight-medium)' }}>
                  Community <span style={{ color: 'var(--destructive)' }}>*</span>
                </Label>
                <Input
                  id="community"
                  value={formData.community}
                  onChange={(e) => handleChange("community", e.target.value)}
                  placeholder={"Enter barangay or community"}
                  required
                  className="mt-2"
                />
              </div>

              {/* Notes */}
              <div className="col-span-2">
                <Label htmlFor="notes" style={{  fontWeight: 'var(--font-weight-medium)' }}>
                  Notes <span style={{  color: 'var(--muted-foreground)' }}>(optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder={"Enter any additional notes or information"}
                  rows={4}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/backoffice/beneficiaries")}
          >
            Cancel
          </Button>
          <Button disabled={updateMutation.isPending} type="submit">
            {isEdit ? "Save Changes" : "Create Beneficiary"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function getCatalogId(
  value:
    | string
    | {
        id: number
        name: string
      }
    | null
    | undefined,
  fallback?: number | null
) {
  if (typeof value === 'object' && value !== null) {
    return String(value.id)
  }
  if (typeof fallback === 'number' && Number.isFinite(fallback)) {
    return String(fallback)
  }
  return ''
}
