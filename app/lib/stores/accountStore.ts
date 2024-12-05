import { Account } from '../utils';

// In-memory store for accounts data
let accountsCache: { data: Account[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to set accounts data
export const setAccounts = (accounts: Account[]) => {
    accountsCache = {
        data: accounts,
        timestamp: Date.now()
    };
};

// Function to get all accounts
export const getAccounts = async () => {
    const now = Date.now();
    
    // If cache exists and is not expired, return cached data
    if (accountsCache && (now - accountsCache.timestamp) < CACHE_DURATION) {
        console.log("Returning cached accounts data");
        const expiresAt = new Date(accountsCache.timestamp + CACHE_DURATION);
        return {
            data: accountsCache.data,
            isCached: true,
            expiresAt
        };
    }

    try {
        console.log("Fetching fresh accounts data from API");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schwab/accounts`, {
            cache: 'no-store' // Disable Next.js cache to ensure fresh data
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch accounts');
        }
        
        const accounts = await response.json();
        setAccounts(accounts);
        return {
            data: accounts,
            isCached: false,
            expiresAt: new Date(Date.now() + CACHE_DURATION)
        };
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return {
            data: [],
            isCached: false,
            expiresAt: new Date()
        };
    }
};

// Function to get a single account by account number
export const getAccountByNumber = async (accountNumber: string) => {
    const { data: accounts } = await getAccounts();
    return accounts.find((account: Account) => account.accountNumber === accountNumber);
};

// Function to clear the cache if needed
export const clearAccountsCache = () => {
    accountsCache = null;
}; 