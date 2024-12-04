import { NextResponse } from 'next/server';
import { Account } from '@/app/lib/utils';
import { tokenService } from '@/app/api/schwab/tokens/schwabTokenService';



export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const accountNumber = searchParams.get('accountNumber');
    const accessToken = await tokenService.getValidToken();
    try {
        if (!accountNumber) {
            return NextResponse.json({ error: 'Account number is required' }, { status: 400 });
        }
        const res = await fetch("https://api.schwabapi.com/trader/v1/accounts/accountNumbers", {
            method: 'GET',
            headers: {
                "Accept-Encoding": "application/json",
                Authorization: "Bearer " + accessToken,
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to get hashed account from Charles Schwab API. Status: ${res.status} - ${res.statusText}`);
        }

        const interfaceData = await res.json();     
       const hashValue = getHashValueByAccount(accountNumber, interfaceData);

        return NextResponse.json(hashValue);

    } catch (error) {
        console.error('Error fetching accounts:', error);
        return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }
} 

const getHashValueByAccount = (accountNumber: string, interfaceData: Array<{ accountNumber: string, hashValue: string }>) => {
    const account = interfaceData.find(item => item.accountNumber === accountNumber);
    return account?.hashValue || "test";
};