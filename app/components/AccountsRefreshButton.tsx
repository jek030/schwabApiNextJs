'use client';

import { Button } from "@/app/ui/button";
import { useRouter } from 'next/navigation';
import { clearAccountsCache } from '../lib/stores/accountStore';
import { useToast } from "@/app/ui/use-toast";

interface AccountsRefreshButtonProps {
  isCached: boolean;
  expiresAt: Date;
}

export default function AccountsRefreshButton({ isCached, expiresAt }: AccountsRefreshButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleRefresh = () => {
    if (isCached) {
      toast({
        title: "Using Cached Data",
        description: "Showing cached results.",
        expiresAt: expiresAt
      });
    }

    clearAccountsCache();
    router.refresh();
  };

  return (
    <Button 
      onClick={handleRefresh}
      className="ml-4"
    >
      Refresh Accounts
    </Button>
  );
} 