import { tokenService } from '@/app/api/schwab/tokens/schwabTokenService';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to process transaction data for frontend
const processTransactionData = (transactionData: any[]) => {
    if (!Array.isArray(transactionData)) {
        console.error('Transaction data is not an array:', transactionData);
        return [];
    }

    return transactionData.map((transaction: any) => {
        if (!transaction?.transferItems) {
            console.error('Transaction is missing transferItems:', transaction);
            return null;
        }

        // Find the trade item (non-currency instrument)
        const tradeItem = transaction.transferItems.find(
            (item: any) => item.instrument?.assetType !== 'CURRENCY'
        );

        // Get all fee items
        const fees = {
            commission: transaction.transferItems.find((item: any) => item.feeType === 'COMMISSION') || { amount: 0, cost: 0 },
            secFee: transaction.transferItems.find((item: any) => item.feeType === 'SEC_FEE') || { amount: 0, cost: 0 },
            optRegFee: transaction.transferItems.find((item: any) => item.feeType === 'OPT_REG_FEE') || { amount: 0, cost: 0 },
            tafFee: transaction.transferItems.find((item: any) => item.feeType === 'TAF_FEE') || { amount: 0, cost: 0 }
        };

        if (!tradeItem || !tradeItem.instrument) {
            console.error('Transaction is missing trade item or instrument:', transaction);
            return null;
        }

        return {
            accountNumber: transaction.accountNumber,
            type: transaction.type,
            tradeDate: transaction.tradeDate,
            netAmount: transaction.netAmount,
            fees,
            trade: {
                symbol: tradeItem.instrument.symbol,
                closingPrice: tradeItem.instrument.closingPrice,
                amount: tradeItem.amount,
                cost: tradeItem.cost,
                price: tradeItem.price,
                positionEffect: tradeItem.positionEffect
            }
        };
    }).filter(Boolean);
};

// Helper function to save transactions to Supabase
const saveToSupabase = async (transactions: any[]) => {
    for (const transaction of transactions) {
        const tradeItem = transaction.transferItems.find(
            (item: any) => item.instrument?.assetType !== 'CURRENCY'
        );

        if (!tradeItem) continue;

        try {
            // Check if transaction already exists by activityId
            const { data: existing, error: checkError } = await supabase
                .from('transactions')
                .select('activityId')
                .eq('activityId', transaction.activityId)
                .maybeSingle();

            if (checkError) {
                console.error('Error checking for existing transaction:', checkError);
                continue;
            }

            if (!existing) {
                // Format the transaction data
                const transactionData = {
                    accountNumber: parseInt(transaction.accountNumber),
                    tradeType: transaction.type,
                    tradeDate: transaction.tradeDate,
                    netAmount: transaction.netAmount,
                    commission: transaction.transferItems.find((item: any) => item.feeType === 'COMMISSION')?.cost || 0,
                    secFee: transaction.transferItems.find((item: any) => item.feeType === 'SEC_FEE')?.cost || 0,
                    optRegFee: transaction.transferItems.find((item: any) => item.feeType === 'OPT_REG_FEE')?.cost || 0,
                    tafFee: transaction.transferItems.find((item: any) => item.feeType === 'TAF_FEE')?.cost || 0,
                    symbol: tradeItem.instrument.symbol,
                    numberShares: tradeItem.amount,
                    cost: tradeItem.cost,
                    price: tradeItem.price,
                    positionEffect: tradeItem.positionEffect,
                    activityId: transaction.activityId,
                    positionId: transaction.positionId,
                    orderId: transaction.orderId,
                    status: transaction.status
                };

                const { error: insertError } = await supabase
                    .from('transactions')
                    .upsert([transactionData], {
                        onConflict: 'activityId',
                        ignoreDuplicates: true
                    });

                if (insertError) {
                    console.error('Error inserting transaction:', insertError);
                }
                console.log('Successfully inserted transaction with activityId:', transaction.activityId);
            } else {
                console.log('Skipping existing transaction with activityId:', transaction.activityId);
            }
        } catch (error) {
            console.error('Error processing transaction:', error);
        }
    }
};

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
        
        // Process data for frontend immediately
        const processedData = processTransactionData(data);
        
        // Start database operation asynchronously without waiting for it
        saveToSupabase(data).catch(error => {
            console.error('Background save to Supabase failed:', error);
        });
        
        // Return the processed data immediately
        return Response.json(processedData);

    } catch (error) {
        console.error('Error fetching transactions:', error);
        return Response.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
} 