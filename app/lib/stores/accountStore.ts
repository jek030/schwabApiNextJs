import { Account } from '../utils';
import { cache } from 'react';

// In-memory store for accounts data
let accountsCache: Account[] = [];

// Function to set accounts data
export const setAccounts = (accounts: Account[]) => {
    accountsCache = accounts;
};

// Cached function to get all accounts
export const getAccounts = cache(async () => {
    if (accountsCache.length === 0) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts`, {
                next: { revalidate: 60 } // Revalidate every 5 minutes
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch accounts');
            }
            
            const accounts = await response.json();
            accountsCache = accounts;
        } catch (error) {
            console.error('Error fetching accounts:', error);
            return [];
        }
    }
    return accountsCache;
});

// Cached function to get a single account by account number
export const getAccountByNumber = cache(async (accountNumber: string) => {
    const accounts = await getAccounts();
    return accounts.find(account => account.accountNumber === accountNumber);
});

// Function to clear the cache if needed
export const clearAccountsCache = () => {
    accountsCache = [];
}; 