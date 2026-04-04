import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTranslation } from "react-i18next";

export function Reports() {
  const { t } = useTranslation();
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 style={{ fontSize: "var(--text-32)", fontWeight: "var(--font-weight-semi-bold)" }}>
          {t('reportsPage.title')}
        </h1>
        <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)", marginTop: "8px" }}>
          {t('reportsPage.subtitle')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('reportsPage.comingSoon')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
            {t('reportsPage.body')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
