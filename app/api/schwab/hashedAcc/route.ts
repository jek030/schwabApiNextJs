import { tokenService } from '@/app/api/schwab/tokens/schwabTokenService';

export async function GET(request: Request) {
    try {
        // Get the accountNumber from the URL parameters
        const { searchParams } = new URL(request.url);
        const accountNumber = searchParams.get('accountNumber');

        if (!accountNumber) {
            return Response.json({ error: 'Account number is required' }, { status: 400 });
        }

        const accessToken = await tokenService.getValidToken();
      
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
        
        // Find the matching account and its hash value
        const account = interfaceData.find((item: any) => item.accountNumber === accountNumber);
        
        if (!account) {
            return Response.json({ error: 'Account not found' }, { status: 404 });
        }

        return Response.json({ hashValue: account.hashValue });
      
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return Response.json({ error: 'Failed to fetch account data' }, { status: 500 });
    }
} 
