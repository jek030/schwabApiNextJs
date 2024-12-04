import { NextResponse } from 'next/server';
import { setAccounts } from '@/app/lib/stores/accountStore';
import { Account } from '@/app/lib/utils';
import { tokenService } from '@/app/api/schwab/tokens/schwabTokenService';

export async function GET() {

    const accessToken = await tokenService.getValidToken();
    try {
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
       
        console.log("interfaceData: " + JSON.stringify(interfaceData, null, 2));
        const formattedAccounts : Account[] = Object.entries(interfaceData).map(([key, value]: [string, any]) => ({
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
                dayProfitLoss:  posValue.currentDayProfitLoss 
            }))
        }));

        // Store the formatted accounts in the server-side cache
        setAccounts(formattedAccounts);
       // console.log("Accounts: " + JSON.stringify(formattedAccounts, null, 2));
        return NextResponse.json(formattedAccounts);

    } catch (error) {
        console.error('Error fetching accounts:', error);
        return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }
} 