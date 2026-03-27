import { useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search as SearchIcon, User } from "lucide-react";
import { useNavigate } from "@/lib/router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useCampaignsQuery } from "@/features/campaigns/hooks/use-campaign-queries";
import { useFieldSearchQuery } from "@/features/field/hooks/use-field-queries";

export function FieldSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const navigate = useNavigate();
  const campaignsQuery = useCampaignsQuery({ page: 1, pageSize: 100, status: 'active' });
  const searchFilters = useMemo(() => ({
    campaignId: selectedCampaignId ? Number(selectedCampaignId) : undefined,
    name: searchQuery.trim() || undefined,
    msisdn: searchQuery.trim() || undefined,
  }), [searchQuery, selectedCampaignId]);
  const searchQueryResult = useFieldSearchQuery(searchFilters, Boolean(selectedCampaignId && searchQuery.trim()));

  const filteredResults = searchQueryResult.data ?? [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 style={{ fontSize: 'var(--text-24)' }}>Search Beneficiaries</h1>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }} className="mt-1">
          Find beneficiary records
        </p>
      </div>

      <div className="mb-4">
        <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select assigned campaign" />
          </SelectTrigger>
          <SelectContent>
            {(campaignsQuery.data?.data ?? []).map((campaign) => (
              <SelectItem key={campaign.id} value={String(campaign.id)}>{campaign.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by name, ID, or National ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
          style={{ fontSize: 'var(--text-16)' }}
        />
      </div>

      {/* Results */}
      {!selectedCampaignId ? (
        <Card>
          <CardContent className="p-8 text-center">
            <SearchIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
              Select a campaign first to search real beneficiary records.
            </p>
          </CardContent>
        </Card>
      ) : searchQuery === '' ? (
        <Card>
          <CardContent className="p-8 text-center">
            <SearchIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
              Enter a search term to find beneficiaries
            </p>
          </CardContent>
        </Card>
      ) : searchQueryResult.isPending ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
              Searching beneficiaries...
            </p>
          </CardContent>
        </Card>
      ) : searchQueryResult.error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--error)' }}>
              {searchQueryResult.error instanceof Error ? searchQueryResult.error.message : 'Search could not be completed.'}
            </p>
          </CardContent>
        </Card>
      ) : filteredResults.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
              No results found for "{searchQuery}"
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((result) => (
            <Card
              key={result.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate(`/field/beneficiary/${result.campaignId}/${result.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-medium)' }}>
                        {result.beneficiary?.name ?? 'Beneficiary'}
                      </p>
                      <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                        CB-{result.id}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={result.disbursementStatus === 'confirmed' ? 'default' : 'outline'}
                    style={{
                      backgroundColor: result.disbursementStatus === 'confirmed' ? 'var(--success)' : undefined,
                      color: result.disbursementStatus === 'confirmed' ? 'var(--success-foreground)' : undefined
                    }}
                  >
                    {formatDisbursementStatus(result.disbursementStatus)}
                  </Badge>
                </div>
                <div className="space-y-1 ml-13">
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                    {result.campaign?.name ?? 'Campaign unavailable'}
                  </p>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                    {result.beneficiary?.msisdn ?? 'No phone number'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDisbursementStatus(status: string) {
  switch (status) {
    case 'confirmed':
      return 'Confirmed';
    case 'not_confirmed':
      return 'Not confirmed';
    case 'not_found':
      return 'Not found';
    case 'pending':
      return 'Pending';
    default:
      return status;
  }
}
