'use client';

import { DataTable } from "../ui/table";
import { Account, IAccount, IInsertAccount } from "../lib/utils";
import { getDbAccounts, insertAccount } from '../lib/database-accounts';
import { columns } from '../lib/accountsTableColumns';
import { useEffect, useState } from 'react';

export default function AccountsTable() {
    const [formattedAccounts, setFormattedAccounts] = useState<Account[]>([]);
    
    useEffect(() => {
        async function fetchData() {
            console.log("In function AccountsTable() in accounts-table.tsx..."); 

            try {
                // Get database accounts
                let rows: IAccount[] = []//await getDbAccounts();
                
                let databaseAccounts: Account[] = Object.entries(rows).map(([key,value]:[string,any]) => ({
                    key: key,
                    accountNumber: value.accountNumber,
                    roundTrips: value.roundTrips,
                    accountValue: value.accountValue,
                    accountEquity: value.accountEquity,
                    cashBalance: value.cashBalance
                }));
                console.log("databaseAccounts.length: " + databaseAccounts.length);

                // Try to get data from Schwab API
                try {
                    const response = await fetch('/api/accounts');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const formattedAccounts = await response.json();
                    setFormattedAccounts(formattedAccounts);

                    // Insert new accounts into database
                    //rawData.forEach(async (acc: Account) => {
                    //    if (!rows.find(item => 
                    //        item.accountNumber === acc.accountNumber && 
                    //        new Date(item.date).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
                    //    )) {
                    //        if (acc.accountNumber) {
                    //            try {
                    //                const newAccount: IInsertAccount = {
                    //                    accountNumber: acc.accountNumber,
                    //                    accountValue: acc.accountValue,
                    //                    accountEquity: acc.accountEquity,
                    //                    roundTrips: acc.roundTrips,
                    //                    cashBalance: acc.cashBalance,
                    //                    date: new Date().toISOString().slice(0, 10)
                    //                };
                    //                await insertAccount(newAccount);
                    //            } catch (error) {
                    //                console.error('Error inserting account:', error);
                    //            }
                    //        }
                    //    }
                    //});

                } catch (error) {
                    console.error("Failed to fetch from API:", error);
                    setFormattedAccounts(databaseAccounts);
                }
            } catch (error) {
                console.error("Error in fetchData:", error);
            }
        }

        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    return <DataTable columns={columns} data={formattedAccounts}/>;
}