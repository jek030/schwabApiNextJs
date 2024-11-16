// components/TradingViewChart.tsx
import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { PriceHistory } from '@/app/lib/utils';

interface TradingViewChartProps {
    priceHistory: PriceHistory[];
}

export default function TradingViewChart({ priceHistory }: TradingViewChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current || !priceHistory.length) return;

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 500,
            layout: {
                background: { color: '#ffffff' },
                textColor: '#333',
            },
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' },
            },
        });

        // Add candlestick series
        const candlestickSeries = chart.addCandlestickSeries();
        
        // Format the price history data for the chart
        const chartData = priceHistory.map(item => {
            const [month, day, year] = item.datetime.split('/');
            const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return {
                time: formattedDate,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close
            };
        });

        console.log("chartData: " + JSON.stringify(chartData, null, 2));

        candlestickSeries.setData(chartData);

        //// Add volume series
        //const volumeSeries = chart.addHistogramSeries({
        //    color: '#26a69a',
        //    priceFormat: { type: 'volume' },
        //    priceScaleId: '', // overlay
        //});
//
        //// Format volume data
        //const volumeData = priceHistory.map(item => {
        //    const [month, day, year] = item.datetime.split('/');
        //    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        //    return {
        //        time: formattedDate,
        //        value: item.volume,
        //        color: item.close >= item.open ? '#26a69a' : '#ef5350'
        //    };
        //});
//
        //volumeSeries.setData(volumeData);

        // Fit the chart content
        chart.timeScale().fitContent();

        // Cleanup on unmount
        return () => {
            chart.remove();
        };
    }, [priceHistory]); // Re-run when priceHistory changes

    return <div ref={chartContainerRef} />;
}