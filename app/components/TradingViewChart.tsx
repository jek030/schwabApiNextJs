// components/TradingViewChart.tsx
import { useEffect, useRef } from 'react';
import { createChart, CrosshairMode, LineStyle, PriceScaleMode } from 'lightweight-charts';
import { PriceHistory } from '@/app/lib/utils';

interface TradingViewChartProps {
    priceHistory: PriceHistory[];
}

export default function TradingViewChart({ priceHistory }: TradingViewChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    //todo - you can use the data points function to update candles if they are above the ATR or something...
    useEffect(() => {
        if (!chartContainerRef.current || !priceHistory.length) return;

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 500,
            layout: {
                background: { color: '#222' },
                textColor: '#DDD',
            },
            grid: {
                vertLines: { color: '#444' },
                horzLines: { color: '#444' },
            },
            rightPriceScale: {
                borderColor: '#71649C',
                scaleMargins: {
                    top: 0.1, // highest point of the series will be 10% away from the top
                    bottom: 0.4, // lowest point will be 40% away from the bottom
                },
                mode: PriceScaleMode.Logarithmic,
            },
            timeScale: {
                borderColor: '#71649C',
            },
            crosshair: {
                // Change mode from default 'magnet' to 'normal'.
                // Allows the crosshair to move freely without snapping to datapoints
                mode: CrosshairMode.Normal,
        
                // Vertical crosshair line (showing Date in Label)
                vertLine: {
                    width: 4,
                    color: '#C3BCDB44',
                    style: LineStyle.Solid,
                    labelBackgroundColor: '#9B7DFF',
                },
        
                // Horizontal crosshair line (showing Price in Label)
                horzLine: {
                    color: '#9B7DFF',
                    labelBackgroundColor: '#9B7DFF',
                },
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

        // Add volume series
        const volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: { type: 'volume' },
            priceScaleId: '', 
            scaleMargins: {
                top: 0.9,
                bottom: 0,
            },
        } as any); // Type assertion to bypass type checking

        // Format volume data
        const volumeData = priceHistory.map(item => {
            const [month, day, year] = item.datetime.split('/');
            const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return {
                time: formattedDate,
                value: item.volume,
                color: item.close >= item.open ? '#26a69a' : '#ef5350'
            };
        });

        volumeSeries.setData(volumeData);

        // Fit the chart content
        chart.timeScale().fitContent();
        
        // Cleanup on unmount
        return () => {
            chart.remove();
        };
    }, [priceHistory]); // Re-run when priceHistory changes

    return <div ref={chartContainerRef} />;
}