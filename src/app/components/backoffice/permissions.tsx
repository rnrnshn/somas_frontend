import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function Permissions() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 style={{ fontSize: "var(--text-32)", fontWeight: "var(--font-weight-semi-bold)" }}>
          Permissions
        </h1>
        <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)", marginTop: "8px" }}>
          Configure system access
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
            Permissions management functionality will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
