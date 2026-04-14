import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Search,
  User,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Camera,
  Upload,
  FileText,
  BarChart3,
  RefreshCw,
  LogOut,
  ChevronRight,
  AlertCircle,
  CheckCheck,
  MessageSquare,
  DollarSign,
  CreditCard
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Screen = 
  | "login" 
  | "home" 
  | "search" 
  | "profile" 
  | "verify" 
  | "selfie" 
  | "submit" 
  | "sync" 
  | "summary"
  | "payment"
  | "payment-verify"
  | "payment-selfie"
  | "payment-result";

export function FieldApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const [phoneConfirmed, setPhoneConfirmed] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"verified" | "rejected" | "pending">("pending");

  // Mock data
  const enumeratorData = {
    name: "João Mateus",
    id: "ENUM-2451",
    assignedBeneficiaries: 45,
    verificationsToday: 12,
    pendingSync: 3
  };

  const beneficiaries = [
    {
      id: "BEN-34521",
      name: "Maria Domingos",
      phone: "+258 84 123 4567",
      province: "Gaza",
      district: "Xai-Xai",
      community: "Chongoene",
      campaign: "Programa de Proteção Social 2026",
      status: "Pendente",
      mobileMoneyProvider: "M-Pesa"
    },
    {
      id: "BEN-34522",
      name: "António Silva",
      phone: "+258 87 234 5678",
      province: "Maputo Província",
      district: "Matola",
      community: "Machava",
      campaign: "Fundo de Assistência de Emergência 2026",
      status: "Verificado",
      mobileMoneyProvider: "e-Mola"
    },
    {
      id: "BEN-34523",
      name: "Fátima José",
      phone: "+258 82 345 6789",
      province: "Inhambane",
      district: "Maxixe",
      community: "Mabil",
      campaign: "Apoio à Educação 2026",
      status: "Pendente",
      mobileMoneyProvider: "M-Pesa"
    }
  ];

  const verificationsToday = [
    {
      id: "VER-001",
      beneficiary: "Maria Domingos",
      time: "09:15",
      status: "Verificado",
      location: "Chongoene, Gaza"
    },
    {
      id: "VER-002",
      beneficiary: "Pedro Mahumane",
      time: "10:30",
      status: "Verificado",
      location: "Xai-Xai, Gaza"
    },
    {
      id: "VER-003",
      beneficiary: "Ana Cossa",
      time: "11:45",
      status: "Rejeitado",
      location: "Chicumbane, Gaza"
    }
  ];

  const pendingSyncRecords = [
    {
      id: "VER-010",
      beneficiary: "Carlos Munguambe",
      type: "Verificação",
      timestamp: "2026-03-06 14:20:00"
    },
    {
      id: "VER-011",
      beneficiary: "Isabel Nhachungue",
      type: "Verificação",
      timestamp: "2026-03-06 14:45:00"
    },
    {
      id: "VER-012",
      beneficiary: "José Sitoe",
      type: "Verificação",
      timestamp: "2026-03-06 15:10:00"
    }
  ];

  const filteredBeneficiaries = beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.phone.includes(searchQuery) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Login Screen
  if (currentScreen === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "var(--background)" }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <User className="w-10 h-10" style={{ color: "var(--primary-foreground)" }} />
            </div>
            <h1 style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
              SOMAS Field
            </h1>
            <p style={{  color: "var(--muted-foreground)", marginTop: "8px" }}>
              Aplicativo de Verificação de Beneficiários
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label style={{  fontWeight: "var(--font-weight-medium)" }}>
                    Email
                  </label>
                  <Input type="email" placeholder={"seu.email@somas.gov"} />
                </div>
                <div className="space-y-2">
                  <label style={{  fontWeight: "var(--font-weight-medium)" }}>
                    Senha
                  </label>
                  <Input type="password" placeholder={"••••••••"} />
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setCurrentScreen("home")}
                >
                  Entrar
                </Button>
              </div>
            </CardContent>
          </Card>

          <p style={{  color: "var(--muted-foreground)", textAlign: "center", marginTop: "16px" }}>
            Versão 1.0.0 • SOMAS Field Operations
          </p>
        </div>
      </div>
    );
  }

  // Home Dashboard
  if (currentScreen === "home") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        {/* Header */}
        <div className="p-4" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p style={{  opacity: 0.9 }}>
                Bem-vindo,
              </p>
              <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                {enumeratorData.name}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentScreen("login")}
              style={{ color: "var(--primary-foreground)" }}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
          <p style={{  opacity: 0.8 }}>
            ID: {enumeratorData.id}
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <p style={{  fontWeight: "var(--font-weight-semi-bold)", color: "var(--primary)" }}>
                  {enumeratorData.assignedBeneficiaries}
                </p>
                <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                  Atribuídos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p style={{  fontWeight: "var(--font-weight-semi-bold)", color: "var(--success)" }}>
                  {enumeratorData.verificationsToday}
                </p>
                <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                  Verificados Hoje
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p style={{  fontWeight: "var(--font-weight-semi-bold)", color: "var(--warning)" }}>
                  {enumeratorData.pendingSync}
                </p>
                <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                  Pendentes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
              Ações Rápidas
            </h3>

            <Card className="cursor-pointer" onClick={() => setCurrentScreen("search")}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--primary)", opacity: 0.1 }}
                    >
                      <Search className="w-5 h-5" style={{ color: "var(--primary)" }} />
                    </div>
                    <div>
                      <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                        Buscar Beneficiário
                      </p>
                      <p style={{  color: "var(--muted-foreground)" }}>
                        Pesquisar por nome, telefone ou código
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer" onClick={() => setCurrentScreen("summary")}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--success)", opacity: 0.1 }}
                    >
                      <BarChart3 className="w-5 h-5" style={{ color: "var(--success)" }} />
                    </div>
                    <div>
                      <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                        Minhas Verificações
                      </p>
                      <p style={{  color: "var(--muted-foreground)" }}>
                        Ver resumo diário
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer" onClick={() => setCurrentScreen("sync")}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--warning)", opacity: 0.1 }}
                    >
                      <RefreshCw className="w-5 h-5" style={{ color: "var(--warning)" }} />
                    </div>
                    <div>
                      <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                        Sincronizar Dados
                      </p>
                      <p style={{  color: "var(--muted-foreground)" }}>
                        {enumeratorData.pendingSync} registros pendentes
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Search Beneficiary Screen
  if (currentScreen === "search") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        {/* Header */}
        <div className="p-4" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentScreen("home")}
              style={{ color: "var(--primary-foreground)" }}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                Buscar Beneficiário
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
            <Input
              placeholder={"Nome, telefone ou código..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              style={{ backgroundColor: "var(--background)" }}
            />
          </div>
        </div>

        <div className="p-4 space-y-3">
          {filteredBeneficiaries.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--muted-foreground)", opacity: 0.5 }} />
              <p style={{  color: "var(--muted-foreground)" }}>
                Nenhum beneficiário encontrado
              </p>
            </div>
          ) : (
            filteredBeneficiaries.map((beneficiary) => (
              <Card 
                key={beneficiary.id} 
                className="cursor-pointer"
                onClick={() => {
                  setSelectedBeneficiary(beneficiary);
                  setCurrentScreen("profile");
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                        {beneficiary.name}
                      </p>
                      <p style={{  color: "var(--muted-foreground)" }}>
                        {beneficiary.id}
                      </p>
                    </div>
                    <Badge variant={beneficiary.status === "Verificado" ? "success" : "outline"}>
                      {beneficiary.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" style={{ color: "var(--muted-foreground)" }} />
                      <p style={{  color: "var(--muted-foreground)" }}>
                        {beneficiary.province} • {beneficiary.district}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3" style={{ color: "var(--muted-foreground)" }} />
                      <p style={{  color: "var(--muted-foreground)" }}>
                        {beneficiary.campaign}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // Beneficiary Profile Screen
  if (currentScreen === "profile" && selectedBeneficiary) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        {/* Header */}
        <div className="p-4" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentScreen("search")}
              style={{ color: "var(--primary-foreground)" }}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                Perfil do Beneficiário
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: "var(--muted)" }}
                >
                  <User className="w-10 h-10" style={{ color: "var(--muted-foreground)" }} />
                </div>
                <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                  {selectedBeneficiary.name}
                </p>
                <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                  {selectedBeneficiary.id}
                </p>
                <div className="mt-3">
                  <Badge variant={selectedBeneficiary.status === "Verificado" ? "success" : "outline"}>
                    {selectedBeneficiary.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Contacto
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                    <p>
                      {selectedBeneficiary.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Localização
                  </p>
                  <div className="flex items-start gap-2 mt-2">
                    <MapPin className="w-4 h-4 mt-0.5" style={{ color: "var(--muted-foreground)" }} />
                    <div>
                      <p>
                        {selectedBeneficiary.province}
                      </p>
                      <p style={{  color: "var(--muted-foreground)" }}>
                        Distrito: {selectedBeneficiary.district}
                      </p>
                      <p style={{  color: "var(--muted-foreground)" }}>
                        Comunidade: {selectedBeneficiary.community}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Programa
                  </p>
                  <div className="flex items-start gap-2 mt-2">
                    <FileText className="w-4 h-4 mt-0.5" style={{ color: "var(--muted-foreground)" }} />
                    <p>
                      {selectedBeneficiary.campaign}
                    </p>
                  </div>
                </div>

                <div>
                  <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Operador de Mobile Money
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                    <p>
                      {selectedBeneficiary.mobileMoneyProvider}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          {selectedBeneficiary.status !== "Verificado" && (
            <Button 
              className="w-full"
              onClick={() => {
                setIdentityConfirmed(false);
                setPhoneConfirmed(false);
                setSelfieCaptured(false);
                setVerificationNotes("");
                setCurrentScreen("verify");
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Iniciar Verificação
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Verification Screen
  if (currentScreen === "verify" && selectedBeneficiary) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        {/* Header */}
        <div className="p-4" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentScreen("profile")}
              style={{ color: "var(--primary-foreground)" }}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                Verificação
              </p>
              <p style={{  opacity: 0.8 }}>
                {selectedBeneficiary.name}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Confirmation Checklist */}
          <Card>
            <CardHeader>
              <CardTitle style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                Confirmar Detalhes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div 
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
                style={{ backgroundColor: identityConfirmed ? "var(--success)" : "var(--muted)", opacity: identityConfirmed ? 0.2 : 1 }}
                onClick={() => setIdentityConfirmed(!identityConfirmed)}
              >
                <div className="flex items-center gap-3">
                  {identityConfirmed ? (
                    <CheckCheck className="w-5 h-5" style={{ color: "var(--success)" }} />
                  ) : (
                    <User className="w-5 h-5" style={{ color: "var(--foreground)" }} />
                  )}
                  <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                    Confirmar Identidade
                  </p>
                </div>
                <div className="w-5 h-5 rounded border-2" style={{ 
                  borderColor: identityConfirmed ? "var(--success)" : "var(--border)",
                  backgroundColor: identityConfirmed ? "var(--success)" : "transparent"
                }}>
                  {identityConfirmed && <CheckCircle className="w-5 h-5" style={{ color: "var(--background)" }} />}
                </div>
              </div>

              <div 
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
                style={{ backgroundColor: phoneConfirmed ? "var(--success)" : "var(--muted)", opacity: phoneConfirmed ? 0.2 : 1 }}
                onClick={() => setPhoneConfirmed(!phoneConfirmed)}
              >
                <div className="flex items-center gap-3">
                  {phoneConfirmed ? (
                    <CheckCheck className="w-5 h-5" style={{ color: "var(--success)" }} />
                  ) : (
                    <Phone className="w-5 h-5" style={{ color: "var(--foreground)" }} />
                  )}
                  <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                    Confirmar Número de Telefone
                  </p>
                </div>
                <div className="w-5 h-5 rounded border-2" style={{ 
                  borderColor: phoneConfirmed ? "var(--success)" : "var(--border)",
                  backgroundColor: phoneConfirmed ? "var(--success)" : "transparent"
                }}>
                  {phoneConfirmed && <CheckCircle className="w-5 h-5" style={{ color: "var(--background)" }} />}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                Notas do Enumerador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={"Adicionar observações sobre a verificação..."}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Selfie Capture */}
          <Card>
            <CardHeader>
              <CardTitle style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                Evidência Fotográfica
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selfieCaptured ? (
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => setCurrentScreen("selfie")}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capturar Selfie
                </Button>
              ) : (
                <div className="text-center p-6 rounded-lg" style={{ backgroundColor: "var(--muted)" }}>
                  <CheckCircle className="w-12 h-12 mx-auto mb-2" style={{ color: "var(--success)" }} />
                  <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                    Foto Capturada
                  </p>
                  <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                    Com localização GPS e timestamp
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setSelfieCaptured(false)}
                  >
                    Capturar Novamente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            className="w-full"
            disabled={!identityConfirmed || !phoneConfirmed || !selfieCaptured}
            onClick={() => setCurrentScreen("submit")}
          >
            Continuar para Submissão
          </Button>
        </div>
      </div>
    );
  }

  // Selfie Capture Screen
  if (currentScreen === "selfie") {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
        {/* Header */}
        <div className="p-4" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentScreen("verify")}
              style={{ color: "var(--primary-foreground)" }}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                Capturar Selfie
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
                Visualização da câmera
              </p>
              <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                Posicione o beneficiário no centro
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
                    Timestamp
                  </p>
                </div>
                <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                  2026-03-06 15:30:45
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                  <p style={{  color: "var(--muted-foreground)" }}>
                    Localização GPS
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
                    Enumerador
                  </p>
                </div>
                <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                  {enumeratorData.id}
                </p>
              </div>
            </div>
          </div>

          <Button 
            className="w-full"
            onClick={() => {
              setSelfieCaptured(true);
              setCurrentScreen("verify");
            }}
          >
            <Camera className="w-4 h-4 mr-2" />
            Capturar Foto
          </Button>
        </div>
      </div>
    );
  }

  // Submit Verification Screen
  if (currentScreen === "submit" && selectedBeneficiary) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        {/* Header */}
        <div className="p-4" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentScreen("verify")}
              style={{ color: "var(--primary-foreground)" }}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                Submeter Verificação
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                Resumo da Verificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Beneficiário
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
                    Identidade
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />
                    <p>Confirmada</p>
                  </div>
                </div>
                <div>
                  <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Telefone
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />
                    <p>Confirmado</p>
                  </div>
                </div>
              </div>

              <div>
                <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Evidência Fotográfica
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />
                  <p>Capturada com GPS</p>
                </div>
              </div>

              {verificationNotes && (
                <div>
                  <p style={{  color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Notas
                  </p>
                  <p style={{  marginTop: "4px" }}>
                    {verificationNotes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Selection */}
          <Card>
            <CardHeader>
              <CardTitle style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                Estado da Verificação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={verificationStatus} onValueChange={(value: any) => setVerificationStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />
                      <span>Verificado</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4" style={{ color: "var(--destructive)" }} />
                      <span>Rejeitado</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" style={{ color: "var(--warning)" }} />
                      <span>Pendente</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            className="w-full"
            onClick={() => {
              // In real app, would save to local storage for sync
              setCurrentScreen("home");
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            Submeter Verificação
          </Button>
        </div>
      </div>
    );
  }

  // Offline Sync Screen
  if (currentScreen === "sync") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        {/* Header */}
        <div className="p-4" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentScreen("home")}
              style={{ color: "var(--primary-foreground)" }}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                Sincronizar Dados
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Sync Status */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: "var(--warning)", opacity: 0.1 }}
                >
                  <RefreshCw className="w-8 h-8" style={{ color: "var(--warning)" }} />
                </div>
                <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                  {pendingSyncRecords.length}
                </p>
                <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                  Registros Pendentes
                </p>
                <p style={{  color: "var(--muted-foreground)", marginTop: "8px" }}>
                  Última sincronização: 14:30
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Records */}
          <div className="space-y-3">
            <h3 style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
              Aguardando Sincronização
            </h3>

            {pendingSyncRecords.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                        {record.beneficiary}
                      </p>
                      <p style={{  color: "var(--muted-foreground)", marginTop: "2px" }}>
                        {record.type} • {record.id}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3" style={{ color: "var(--muted-foreground)" }} />
                        <p style={{  color: "var(--muted-foreground)" }}>
                          {record.timestamp}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Pendente</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sync Button */}
          <Button className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sincronizar Agora
          </Button>

          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: "var(--muted)" }}
          >
            <p style={{  color: "var(--muted-foreground)" }}>
              ℹ️ Os dados serão sincronizados automaticamente quando houver conexão à internet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Daily Summary Screen
  if (currentScreen === "summary") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        {/* Header */}
        <div className="p-4" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentScreen("home")}
              style={{ color: "var(--primary-foreground)" }}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <p style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
                Resumo Diário
              </p>
              <p style={{  opacity: 0.8 }}>
                6 de Março de 2026
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <p style={{  fontWeight: "var(--font-weight-semi-bold)", color: "var(--primary)" }}>
                  {verificationsToday.length}
                </p>
                <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                  Total de Verificações
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p style={{  fontWeight: "var(--font-weight-semi-bold)", color: "var(--success)" }}>
                  {verificationsToday.filter(v => v.status === "Verificado").length}
                </p>
                <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                  Verificações Bem Sucedidas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p style={{  fontWeight: "var(--font-weight-semi-bold)", color: "var(--destructive)" }}>
                  {verificationsToday.filter(v => v.status === "Rejeitado").length}
                </p>
                <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                  Rejeitadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p style={{  fontWeight: "var(--font-weight-semi-bold)", color: "var(--warning)" }}>
                  {pendingSyncRecords.length}
                </p>
                <p style={{  color: "var(--muted-foreground)", marginTop: "4px" }}>
                  Registros Pendentes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Verification History */}
          <div className="space-y-3">
            <h3 style={{  fontWeight: "var(--font-weight-semi-bold)" }}>
              Histórico de Hoje
            </h3>

            {verificationsToday.map((verification) => (
              <Card key={verification.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p style={{  fontWeight: "var(--font-weight-medium)" }}>
                        {verification.beneficiary}
                      </p>
                      <p style={{  color: "var(--muted-foreground)" }}>
                        {verification.id}
                      </p>
                    </div>
                    <Badge variant={verification.status === "Verificado" ? "success" : "destructive"}>
                      {verification.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" style={{ color: "var(--muted-foreground)" }} />
                      <p style={{  color: "var(--muted-foreground)" }}>
                        {verification.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" style={{ color: "var(--muted-foreground)" }} />
                      <p style={{  color: "var(--muted-foreground)" }}>
                        {verification.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}