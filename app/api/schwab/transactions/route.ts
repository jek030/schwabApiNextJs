import { tokenService } from '@/app/api/schwab/tokens/schwabTokenService';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const hashedAccount = searchParams.get('hashedAccount');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const types = searchParams.get('types') || 'TRADE';

    try {
        if (!hashedAccount) {
            return Response.json({ error: 'Hashed account number is required' }, { status: 400 });
        }
        if (!startDate || !endDate) {
            return Response.json({ error: 'Start date and end date are required' }, { status: 400 });
        }

        const accessToken = await tokenService.getValidToken();

        const url = new URL(`https://api.schwabapi.com/trader/v1/accounts/${hashedAccount}/transactions`);
        url.searchParams.append('startDate', startDate);
        url.searchParams.append('endDate', endDate);
        url.searchParams.append('types', types);

        console.log("\n\nurl: " + url.toString());
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch transactions. Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return Response.json(data);

    } catch (error) {
        console.error('Error fetching transactions:', error);
        return Response.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
} 