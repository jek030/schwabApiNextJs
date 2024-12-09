// components/TradingViewChart.tsx
import { useEffect, useRef } from 'react';
import { createChart, CrosshairMode, LineStyle, PriceScaleMode } from 'lightweight-charts';
import { PriceHistory } from '@/app/lib/utils';

interface TradingViewChartProps {
    priceHistory: PriceHistory[];
}



export default function TradingViewChart({ priceHistory }: TradingViewChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!chartContainerRef.current || !priceHistory.length) return;

        chartRef.current = createChart(chartContainerRef.current, {
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

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
                
                // Refit the content after resize
                chartRef.current.timeScale().fitContent();
            }
        };

        window.addEventListener('resize', handleResize);

        // Add candlestick series
        const candlestickSeries = chartRef.current.addCandlestickSeries();
        
        // Format the price history data for the chart
        const chartData = priceHistory.map(item => {
            // Handle date formatting more robustly
            const date = new Date(item.datetime);
            if (isNaN(date.getTime())) {
                // If the date string can't be parsed directly, try parsing MM/DD/YYYY format
                const [month, day, year] = item.datetime.split('/');
                return {
                    time: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close
                };
            }
            
            // Format date as YYYY-MM-DD if it's already a valid date
            return {
                time: date.toISOString().split('T')[0],
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close
            };
        });

        //console.log("chartData: " + JSON.stringify(chartData, null, 2));

        candlestickSeries.setData(chartData);

        // Add volume series
        const volumeSeries = chartRef.current.addHistogramSeries({
            color: '#26a69a',
            priceFormat: { type: 'volume' },
            priceScaleId: '', 
            scaleMargins: {
                top: 0.7,
                bottom: 0,
            },
        } as any); // Type assertion to bypass type checking

        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.7, // highest point of the series will be 70% away from the top
                bottom: 0,
            },
        });
        // Format volume data
        const volumeData = priceHistory.map(item => {
            // Handle date formatting more robustly
            const date = new Date(item.datetime);
            let formattedDate;
            
            if (isNaN(date.getTime())) {
                // If the date string can't be parsed directly, try parsing MM/DD/YYYY format
                const [month, day, year] = item.datetime.split('/');
                formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            } else {
                formattedDate = date.toISOString().split('T')[0];
            }

            return {
                time: formattedDate,
                value: item.volume,
                color: item.close >= item.open ? '#26a69a' : '#ef5350'
            };
        });

        volumeSeries.setData(volumeData);

        const maData20 = calculateMovingAverageSeriesData(chartData, 20);
        const maSeries20 = chartRef.current.addLineSeries({ color: '#2962FF', lineWidth: 1 });
        maSeries20.setData(maData20);
        
        const maData10 = calculateMovingAverageSeriesData(chartData, 10);
        const maSeries10 = chartRef.current.addLineSeries({ color: '#DAA520', lineWidth: 1 });
        maSeries10.setData(maData10);
        
        const maData50 = calculateMovingAverageSeriesData(chartData, 50);
        const maSeries50 = chartRef.current.addLineSeries({ color: '#9370DB', lineWidth: 1 });
        maSeries50.setData(maData50);

        const maData200 = calculateMovingAverageSeriesData(chartData, 200);
        const maSeries200 = chartRef.current.addLineSeries({ color: '#CD5C5C', lineWidth: 1 });
        maSeries200.setData(maData200);

        // Fit the chart content
        chartRef.current.timeScale().fitContent();
        
        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, [priceHistory]); // Re-run when priceHistory changes

    return <div ref={chartContainerRef} style={{ width: '100%' }} />;
}

function calculateMovingAverageSeriesData(candleData: any[], maLength: number) {
    const maData = [];

    for (let i = 0; i < candleData.length; i++) {
        if (i < maLength) {
            // Provide whitespace data points until the MA can be calculated
            maData.push({ time: candleData[i].time });
        } else {
            // Calculate the moving average, slow but simple way
            let sum = 0;
            for (let j = 0; j < maLength; j++) {
                sum += candleData[i - j].close;
            }
            const maValue = sum / maLength;
            maData.push({ time: candleData[i].time, value: maValue });
        }
    }

    return maData;
}