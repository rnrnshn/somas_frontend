import { useState } from "react";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger} from "../ui/dropdown-menu";
import { cn } from "../../../lib/utils";

interface Tenant {
  id: string;
  name: string;
  logo?: string;
}

const MOCK_TENANTS: Tenant[] = [
  { id: "1", name: "Ministry of Social Affairs" },
  { id: "2", name: "National Relief Program" },
  { id: "3", name: "Regional Development Authority" },
  { id: "4", name: "Emergency Response Unit" },
];

export function TenantSwitcher() {
  const [currentTenant, setCurrentTenant] = useState<Tenant>(MOCK_TENANTS[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleTenantSwitch = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    setIsOpen(false);
    // In a real app, trigger secure session switch here
    console.log("Switching to tenant:", tenant.name);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" align="end">
        <DropdownMenuLabel style={{  color: 'var(--muted-foreground)' }}>
          Switch Tenant
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MOCK_TENANTS.map((tenant) => (
          <DropdownMenuItem
            key={tenant.id}
            onSelect={() => handleTenantSwitch(tenant)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <div 
                className="w-6 h-6 rounded-[var(--radius)] bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <Building2 className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="flex-1 truncate">{tenant.name}</span>
              {currentTenant.id === tenant.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
