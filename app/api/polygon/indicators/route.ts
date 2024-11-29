import { NextResponse } from 'next/server';
import { PolygonSMAResponse } from '@/app/lib/utils';


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const indicator = searchParams.get('indicator') || 'sma';
    const window = searchParams.get('window') || '20';
    const limit = searchParams.get('limit') || '100';
    const timespan = searchParams.get('timespan') || 'day';
  
    const polygonApiKey = process.env.POLYGON_API_KEY;
    try {
        const res = await fetch(`https://api.polygon.io/v1/indicators/${indicator}/${ticker}?timespan=${timespan}&adjusted=true&window=${window}&series_type=close&order=desc&limit=${limit}&apiKey=${polygonApiKey}`,
                { next: 
                    { revalidate: 3600 } // Optional: cache for 1 hour
            }
        );

        if (!res.ok) {
            throw new Error(`Failed to get ${indicator} from Polygon API. Status: ${res.status} - ${res.statusText}`);
        }

        const indicatorData = await res.json();

       let formattedSMAData: PolygonSMAResponse = {
        results: {
            values: indicatorData.results.values.map((entry: { timestamp: number; value: number }) => ({
                date: new Date(entry.timestamp).toLocaleDateString(),
                value: Number(entry.value.toFixed(2))
            }))
        },
        status: indicatorData.status,
        request_id: indicatorData.request_id
       }    
        //console.log("formattedSMAData: " + JSON.stringify(formattedSMAData, null, 2));

        return NextResponse.json(formattedSMAData);

    } catch (error) {
        console.error('Error fetching indicator data:', error);
        return NextResponse.json({ error: 'Failed to fetch indicator data' }, { status: 500 });
    }
} 