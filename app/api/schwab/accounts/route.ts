import { NextResponse } from 'next/server';
import { setAccounts } from '@/app/lib/stores/accountStore';
import { Account } from '@/app/lib/utils';
import { tokenService } from '@/app/api/schwab/tokens/schwabTokenService';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Hash account number using SHA-256
function hashAccountNumber(accountNumber: string): string {
  const secret = process.env.HASH_SECRET || 'default-secret-key';
  return crypto
    .createHmac('sha256', secret)
    .update(accountNumber)
    .digest('hex');
}

// Create a separate table for hash mappings
type HashMapping = {
  id: number;
  accountHashMap: string;
  reverseHashMap: string;
  created_at: string;
};

// Initialize maps
const accountHashMap = new Map<string, string>();
const reverseHashMap = new Map<string, string>();

// Load hash mappings from database
async function loadHashMappings() {
  const { data, error } = await supabase
    .from('account_mappings')
    .select('*');

  if (error) {
    console.error('Error loading hash mappings:', error);
    return false;
  }

  if (data && data.length > 0) {
    data.forEach((mapping: HashMapping) => {
      accountHashMap.set(mapping.reverseHashMap, mapping.accountHashMap);
      reverseHashMap.set(mapping.accountHashMap, mapping.reverseHashMap);
    });
    return true;
  }
  return false;
}

async function storeInitialMappings(accounts: Account[]) {
  const mappings = accounts.map(account => ({
    accountHashMap: hashAccountNumber(account.accountNumber),
    reverseHashMap: account.accountNumber
  }));

  const { error } = await supabase
    .from('account_mappings')
    .insert(mappings);

  if (error) {
    console.error('Error storing initial mappings:', error);
    return;
  }

  // Store in memory maps after successful database insert
  mappings.forEach(mapping => {
    accountHashMap.set(mapping.reverseHashMap, mapping.accountHashMap);
    reverseHashMap.set(mapping.accountHashMap, mapping.reverseHashMap);
  });
}

async function getTodaysRecords() {
  // Load mappings if maps are empty
  if (reverseHashMap.size === 0) {
    await loadHashMappings();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('accounthistory')
    .select('*')
    .gte('created_at', today.toISOString());

  if (error) {
    console.error('Error fetching today\'s records:', error);
    return null;
  }

  // Convert hashed account numbers back to original
  if (data) {
    data.forEach(record => {
      const originalAccount = reverseHashMap.get(record.accountNumber);
      if (originalAccount) {
        record.accountNumber = originalAccount;
      }
    });
  }

  return data;
}

async function fetchAndStoreAccounts(): Promise<Account[]> {
  const accessToken = await tokenService.getValidToken();
  const res = await fetch("https://api.schwabapi.com/trader/v1/accounts?fields=positions", {
    method: 'GET',
    headers: {
      "Accept-Encoding": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to getAccounts from Charles Schwab API. Status: ${res.status} - ${res.statusText}`);
  }

  const interfaceData = await res.json();
  const formattedAccounts: Account[] = Object.entries(interfaceData).map(([key, value]: [string, any]) => ({
    key: key,
    accountNumber: value?.securitiesAccount?.accountNumber,
    roundTrips: value?.securitiesAccount?.roundTrips,
    accountValue: value?.securitiesAccount?.initialBalances?.accountValue,
    accountEquity: value?.securitiesAccount?.currentBalances?.equity,
    cashBalance: value?.securitiesAccount?.initialBalances?.cashBalance,
    positions: Object.entries(value?.securitiesAccount?.positions || {}).map(([posKey, posValue]: [string, any]) => ({
      key: posKey,
      symbol: posValue.instrument.symbol,
      marketValue: posValue.marketValue,
      averagePrice: posValue.averagePrice,
      longQuantity: posValue.longQuantity,
      longOpenProfitLoss: posValue.longOpenProfitLoss,
      netChange: posValue.instrument.netChange,
      dayProfitLoss: posValue.currentDayProfitLoss
    }))
  }));

  // Check if we need to create initial mappings
  const hasMappings = await loadHashMappings();
  if (!hasMappings) {
    console.log('Creating initial account mappings...');
    await storeInitialMappings(formattedAccounts);
  }

  // Store accounts in Supabase
  for (const account of formattedAccounts) {
    const hashedAccountNumber = accountHashMap.get(account.accountNumber);
    if (!hashedAccountNumber) {
      console.error('No hash mapping found for account:', account.accountNumber);
      continue;
    }

    const insertData = {
      accountNumber: hashedAccountNumber,
      accountValue: Number(account.accountValue) || 0,
      accountEquity: Number(account.accountEquity) || 0,
      cashBalance: Number(account.cashBalance) || 0,
      roundTrips: Number(account.roundTrips) || 0,
      positions: account.positions || []
    };

    const { error } = await supabase
      .from('accounthistory')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Supabase error for account:', hashedAccountNumber, error);
    } else {
      console.log('Successfully inserted account:', hashedAccountNumber);
    }
  }

  return formattedAccounts;
}

function convertSupabaseToAccount(supabaseData: any[]): Account[] {
  return supabaseData.map(record => ({
    key: record.accountNumber,
    accountNumber: record.accountNumber, // Already converted back to original in getTodaysRecords
    roundTrips: record.roundTrips,
    accountValue: record.accountValue,
    accountEquity: record.accountEquity,
    cashBalance: record.cashBalance,
    positions: record.positions
  }));
}

export async function GET() {
  try {
    const todaysRecords = await getTodaysRecords();

    let accounts: Account[];
    if (todaysRecords && todaysRecords.length > 0) {
      console.log('Using stored data from Supabase');
      accounts = convertSupabaseToAccount(todaysRecords);
    } else {
      console.log('Fetching fresh data from API');
      accounts = await fetchAndStoreAccounts();
    }

    setAccounts(accounts);
    return NextResponse.json(accounts);

  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
} 