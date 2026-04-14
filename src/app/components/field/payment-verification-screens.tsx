// Payment Verification Flow Screens for Field App
// These screens handle payment verification for beneficiaries

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ChevronRight,
  DollarSign,
  Phone,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Camera,
  MapPin,
  User,
  AlertCircle,
  Upload
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useTranslation } from "react-i18next";

interface PaymentScreenProps {
  onBack: () => void;
  onNext: () => void;
  selectedBeneficiary: any;
  enumeratorData: any;
}

// Beneficiary Payment Screen
export function BeneficiaryPaymentScreen({ onBack, onNext, selectedBeneficiary }: PaymentScreenProps) {
  const { t, i18n } = useTranslation();
  // Mock payment data
  const paymentData = {
    transactionRef: "TXN-87654321",
    campaign: selectedBeneficiary.campaign,
    amount: 3400,
    currency: "MZN",
    paymentDate: "2026-03-05",
    provider: selectedBeneficiary.mobileMoneyProvider,
    phone: selectedBeneficiary.phone
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Header */}
      <div className="p-4" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            style={{ color: "var(--primary-foreground)" }}
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Button>
          <div>
            <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
              {t('paymentVerificationPage.paymentVerification')}
            </p>
            <p style={{  opacity: 0.8 }}>
              {selectedBeneficiary.name}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Payment Information Card */}
        <Card>
          <CardHeader>
            <CardTitle style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
              {t('paymentVerificationPage.latestPayment')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Amount */}
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "var(--muted)" }}>
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: "var(--success)", opacity: 0.1 }}
              >
                <DollarSign className="w-8 h-8" style={{ color: "var(--success)" }} />
              </div>
              <p style={{  fontWeight: "var(--font-weight-semi-bold)", color: "var(--success)" }}>
                {paymentData.currency} {paymentData.amount.toLocaleString('pt-MZ')}
              </p>
              <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                 {t('paymentVerificationPage.paymentAmount')}
              </p>
            </div>

            {/* Transaction Reference */}
            <div>
              <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t('paymentVerificationPage.transactionReference')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <CreditCard className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                  {paymentData.transactionRef}
                </p>
              </div>
            </div>

            {/* Campaign */}
            <div>
              <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t('campaignsPage.program')}
              </p>
              <p style={{  marginTop: "8px" }}>
                {paymentData.campaign}
              </p>
            </div>

            {/* Payment Date */}
            <div>
              <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t('paymentVerificationPage.paymentDate')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                <p>
                  {new Date(paymentData.paymentDate).toLocaleDateString(i18n.language === 'pt' ? 'pt-MZ' : 'en-US', { 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Mobile Money Provider */}
            <div>
              <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t('paymentVerificationPage.mobileMoneyProvider')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Phone className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                <p>
                  {paymentData.provider}
                </p>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t('fieldBeneficiaryPage.phoneNumber')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Phone className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                <p>
                  {paymentData.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verify Button */}
        <Button className="w-full" onClick={onNext}>
          <CheckCircle className="w-4 h-4 mr-2" />
          {t('paymentVerificationPage.verifyPayment')}
        </Button>
      </div>
    </div>
  );
}

// Payment Verification Form Screen
export function PaymentVerificationFormScreen({ onBack, onNext, selectedBeneficiary }: PaymentScreenProps & {
  paymentReceived: string;
  setPaymentReceived: (v: string) => void;
  phoneNumberConfirmed: string;
  setPhoneNumberConfirmed: (v: string) => void;
  issueReported: string;
  setIssueReported: (v: string) => void;
  paymentNotes: string;
  setPaymentNotes: (v: string) => void;
}) {
  const { t } = useTranslation();
  const [paymentReceived, setPaymentReceived] = React.useState("yes");
  const [phoneNumberConfirmed, setPhoneNumberConfirmed] = React.useState("yes");
  const [issueReported, setIssueReported] = React.useState("");
  const [paymentNotes, setPaymentNotes] = React.useState("");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Header */}
      <div className="p-4" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            style={{ color: "var(--primary-foreground)" }}
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Button>
          <div>
            <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
              {t('paymentVerificationPage.verificationForm')}
            </p>
            <p style={{  opacity: 0.8 }}>
              {selectedBeneficiary.name}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Payment Received */}
        <Card>
          <CardHeader>
            <CardTitle style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
               {t('paymentVerificationPage.paymentReceived')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={paymentReceived} onValueChange={setPaymentReceived}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />
                     <span>{t('createCampaignPage.yes')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="no">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" style={{ color: "var(--destructive)" }} />
                     <span>{t('createCampaignPage.no')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Phone Number Confirmed */}
        <Card>
          <CardHeader>
            <CardTitle style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
               {t('paymentVerificationPage.phoneConfirmed')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={phoneNumberConfirmed} onValueChange={setPhoneNumberConfirmed}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />
                     <span>{t('createCampaignPage.yes')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="no">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" style={{ color: "var(--destructive)" }} />
                     <span>{t('createCampaignPage.no')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Issue Reported */}
        <Card>
          <CardHeader>
            <CardTitle style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
               {t('paymentVerificationPage.issueReported')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={issueReported} onValueChange={setIssueReported}>
              <SelectTrigger>
                 <SelectValue placeholder={t('paymentVerificationPage.selectIssue')} />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="">{t('paymentVerificationPage.none')}</SelectItem>
                 <SelectItem value="wrong-amount">{t('paymentVerificationPage.wrongAmount')}</SelectItem>
                 <SelectItem value="not-received">{t('paymentVerificationPage.didNotReceive')}</SelectItem>
                 <SelectItem value="wrong-number">{t('paymentVerificationPage.wrongNumber')}</SelectItem>
                 <SelectItem value="technical-issue">{t('paymentVerificationPage.technicalIssue')}</SelectItem>
                 <SelectItem value="other">{t('paymentVerificationPage.other')}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Enumerator Notes */}
        <Card>
          <CardHeader>
            <CardTitle style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
               {t('paymentVerificationPage.enumeratorNotes')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t('paymentVerificationPage.enumeratorNotesPlaceholder')}
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Next Button */}
        <Button 
          className="w-full"
          onClick={onNext}
        >
          {t('paymentVerificationPage.captureEvidence')}
        </Button>
      </div>
    </div>
  );
}

// Payment Selfie Capture Screen
export function PaymentSelfieScreen({ onBack, onNext, enumeratorData }: PaymentScreenProps) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
      {/* Header */}
      <div className="p-4" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            style={{ color: "var(--primary-foreground)" }}
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Button>
          <div>
            <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
              {t('paymentVerificationPage.captureEvidence')}
            </p>
          </div>
        </div>
      </div>

      {/* Camera Preview Placeholder */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="w-full max-w-sm aspect-[3/4] rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "var(--muted)" }}
        >
          <div className="text-center">
            <Camera className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--muted-foreground)" }} />
            <p style={{  color: "var(--muted-foreground)" }}>
               {t('paymentVerificationPage.cameraPreview')}
            </p>
            <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
               {t('paymentVerificationPage.centerBeneficiary')}
            </p>
          </div>
        </div>
      </div>

      {/* Capture Information */}
      <div className="p-4 space-y-3">
        <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--muted)" }}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                <p style={{  color: "var(--muted-foreground)" }}>
                   {t('paymentVerificationPage.timestamp')}
                </p>
              </div>
              <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                2026-03-06 16:45:12
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                <p style={{  color: "var(--muted-foreground)" }}>
                   {t('paymentVerificationPage.gpsLocation')}
                </p>
              </div>
              <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                -25.0392, 33.6349
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                <p style={{  color: "var(--muted-foreground)" }}>
                   {t('paymentVerificationPage.enumerator')}
                </p>
              </div>
              <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                {enumeratorData.id}
              </p>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={onNext}>
          <Camera className="w-4 h-4 mr-2" />
           {t('paymentVerificationPage.capturePhoto')}
        </Button>
      </div>
    </div>
  );
}

// Payment Verification Result Screen
export function PaymentVerificationResultScreen({ onBack, selectedBeneficiary }: PaymentScreenProps & {
  verificationResult: string;
  setVerificationResult: (v: string) => void;
  onSubmit: () => void;
}) {
  const { t } = useTranslation();
  const [verificationResult, setVerificationResult] = React.useState("confirmed");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Header */}
      <div className="p-4" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            style={{ color: "var(--primary-foreground)" }}
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Button>
          <div>
            <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
              {t('paymentVerificationPage.verificationResult')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
              {t('paymentVerificationPage.paymentVerificationSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                 {t('paymentVerificationPage.beneficiary')}
              </p>
              <p style={{  fontWeight: "var(--font-weight-medium)", marginTop: "4px" }}>
                {selectedBeneficiary.name}
              </p>
              <p style={{  color: "var(--muted-foreground)" }}>
                {selectedBeneficiary.id}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t('paymentVerificationPage.payment')}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />
                  <p>{t('paymentVerificationPage.received')}</p>
                </div>
              </div>
              <div>
                <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t('paymentVerificationPage.phone')}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />
                  <p>{t('paymentVerificationPage.confirmed')}</p>
                </div>
              </div>
            </div>

            <div>
              <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em)" }}>
                {t('paymentVerificationPage.photoEvidence')}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />
                <p>{t('paymentVerificationPage.capturedWithGps')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
              {t('paymentVerificationPage.verificationStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={verificationResult} onValueChange={setVerificationResult}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />
                    <span>{t('paymentVerificationPage.confirmed')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="not-received">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" style={{ color: "var(--destructive)" }} />
                    <span>{t('paymentVerificationPage.notReceived')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="issue-reported">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" style={{ color: "var(--warning)" }} />
                    <span>{t('paymentVerificationPage.issueReportedStatus')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Offline Support */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--muted)" }}>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 mt-0.5" style={{ color: "var(--warning)" }} />
            <div>
              <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                {t('paymentVerificationPage.pendingSyncStatus')}
              </p>
              <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                {t('paymentVerificationPage.pendingSyncHelp')}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button className="w-full" onClick={() => {
          // In real app, save to local storage
          // props.onSubmit();
        }}>
          <Upload className="w-4 h-4 mr-2" />
          {t('paymentVerificationPage.submitVerification')}
        </Button>
      </div>
    </div>
  );
}
