'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { clearAccountsCache } from '../lib/stores/accountStore';

export default function RefreshButton() {
  const router = useRouter();

  const handleRefresh = async () => {
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