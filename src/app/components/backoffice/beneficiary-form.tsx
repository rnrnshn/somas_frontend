import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@/lib/router";
import { useBeneficiaryDetailQueries } from "@/features/beneficiaries/hooks/use-beneficiary-queries";
import { useUpdateBeneficiaryMutation } from "@/features/beneficiaries/hooks/use-beneficiary-mutations";
import { HttpError } from "@/lib/api/http-error";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ArrowLeft } from "lucide-react";

export function BeneficiaryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const beneficiaryId = Number(id);
  const isEdit = Number.isFinite(beneficiaryId);
  const queries = useBeneficiaryDetailQueries(beneficiaryId);
  const updateMutation = useUpdateBeneficiaryMutation(beneficiaryId);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    community: "",
    notes: "",
  });

  useEffect(() => {
    const profile = queries.profile.data;
    if (!profile) return;
    setFormData({
      fullName: profile.name,
      phone: profile.msisdn,
      email: profile.email ?? '',
      province: profile.province ?? '',
      district: profile.district ?? '',
      community: profile.community ?? '',
      notes: profile.notes ?? '',
    });
  }, [queries.profile.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isEdit) {
      setSubmitError('Create beneficiary is not wired yet with the current backend surface.');
      return;
    }

    void updateMutation
      .mutateAsync({
        name: formData.fullName,
        msisdn: formData.phone,
        email: formData.email || null,
        province: formData.province || null,
        district: formData.district || null,
        community: formData.community || null,
        notes: formData.notes || null,
      })
      .then(() => {
        navigate(`/backoffice/beneficiaries/profile/${beneficiaryId}`);
      })
      .catch((error) => {
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
        <h1 style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)' }}>
          {isEdit ? "Edit Beneficiary" : "Create New Beneficiary"}
        </h1>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
          {isEdit ? "Update beneficiary information" : "Add a new beneficiary to the system"}
        </p>
        {isEdit && queries.profile.isPending ? (
          <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginTop: '8px' }}>Loading beneficiary...</p>
        ) : null}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h3 style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
              Beneficiary Information
            </h3>
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
              Enter the required information for the beneficiary
            </p>
          </CardHeader>
          <CardContent>
            {submitError ? (
              <p style={{ fontSize: 'var(--text-13)', color: 'var(--error)', marginBottom: '16px' }}>{submitError}</p>
            ) : null}
            <div className="grid grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="col-span-2">
                <Label htmlFor="fullName" style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                  Full Name <span style={{ color: 'var(--destructive)' }}>*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Enter full name"
                  required
                  className="mt-2"
                />
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone" style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                  Phone Number <span style={{ color: 'var(--destructive)' }}>*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+63 XXX XXX XXXX"
                  required
                  className="mt-2"
                />
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                  Include country code (e.g., +63 for Philippines)
                </p>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                  Email <span style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>(optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@example.com"
                  className="mt-2"
                />
              </div>

              {/* Province */}
              <div>
                <Label htmlFor="province" style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                  Province <span style={{ color: 'var(--destructive)' }}>*</span>
                </Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) => handleChange("province", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Albay">Albay</SelectItem>
                    <SelectItem value="Camarines Sur">Camarines Sur</SelectItem>
                    <SelectItem value="Camarines Norte">Camarines Norte</SelectItem>
                    <SelectItem value="Catanduanes">Catanduanes</SelectItem>
                    <SelectItem value="Masbate">Masbate</SelectItem>
                    <SelectItem value="Sorsogon">Sorsogon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div>
                <Label htmlFor="district" style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                  District <span style={{ color: 'var(--destructive)' }}>*</span>
                </Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                  placeholder="Enter district or city"
                  required
                  className="mt-2"
                />
              </div>

              {/* Community */}
              <div className="col-span-2">
                <Label htmlFor="community" style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                  Community <span style={{ color: 'var(--destructive)' }}>*</span>
                </Label>
                <Input
                  id="community"
                  value={formData.community}
                  onChange={(e) => handleChange("community", e.target.value)}
                  placeholder="Enter barangay or community"
                  required
                  className="mt-2"
                />
              </div>

              {/* Notes */}
              <div className="col-span-2">
                <Label htmlFor="notes" style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                  Notes <span style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>(optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Enter any additional notes or information"
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
