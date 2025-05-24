'use client';

import {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {STARTING_PRICE, GROWTH_RATE} from '@/lib/types/trading.types';

function calculateCustomPrice(supply: number, startingPrice: number, growthRate: number): number {
    return startingPrice * Math.exp(growthRate * supply);
}

interface BondingCurveChartProps {
    currentSupply: number;
    maxSupply?: number;
    startingPrice?: number;
    growthRate?: number;
    previewMode?: boolean;
}

export function BondingCurveChart({
                                      currentSupply,
                                      maxSupply = Number.MAX_SAFE_INTEGER,
                                      startingPrice = STARTING_PRICE,
                                      growthRate = GROWTH_RATE,
                                      previewMode = false
                                  }: BondingCurveChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoverPoint, setHoverPoint] = useState<{ supply: number, price: number } | null>(null);

    const drawChart = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const width = rect.width;
        const height = rect.height;
        const padding = previewMode ? 30 : 60;

        const points = [];
        const numPoints = 100;

        const maxDisplaySupply = previewMode ? 1000 : Math.max(currentSupply * 1.5, 100);

        for (let i = 0; i < numPoints; i++) {
            const t = i / (numPoints - 1);
            const supply = t * t * maxDisplaySupply;
            const price = calculateCustomPrice(supply, startingPrice, growthRate);
            points.push({supply, price});
        }

        const maxPrice = Math.max(...points.map(p => p.price)) * 1.1; // Add 10% margin

        ctx.beginPath();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;

        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);

        ctx.moveTo(padding, height - padding);
        ctx.lineTo(padding, padding);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;

        points.forEach((point, i) => {
            const x = padding + (point.supply / maxDisplaySupply) * (width - 2 * padding);
            const y = height - padding - (point.price / maxPrice) * (height - 2 * padding);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.fill();

        const currentX = padding + (currentSupply / maxDisplaySupply) * (width - 2 * padding);
        const currentY = height - padding - (calculateCustomPrice(currentSupply, startingPrice, growthRate) / maxPrice) * (height - 2 * padding);

        ctx.beginPath();
        ctx.arc(currentX, currentY, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#ec4899';
        ctx.fill();

        ctx.font = '12px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';

        ctx.fillText('Supply', width / 2, height - 5);

        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Price (ZTH)', 0, 0);
        ctx.restore();

        if (!previewMode) {
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';

            const numYTicks = 5;
            for (let i = 0; i <= numYTicks; i++) {
                const price = (i / numYTicks) * maxPrice;
                const y = height - padding - (price / maxPrice) * (height - 2 * padding);

                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(padding - 5, y);
                ctx.stroke();

                ctx.fillText(price.toFixed(2), padding - 8, y);
            }

            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            const numXTicks = 5;
            for (let i = 0; i <= numXTicks; i++) {
                const supply = (i / numXTicks) * maxDisplaySupply;
                const x = padding + (supply / maxDisplaySupply) * (width - 2 * padding);

                ctx.beginPath();
                ctx.moveTo(x, height - padding);
                ctx.lineTo(x, height - padding + 5);
                ctx.stroke();

                const formattedSupply = supply >= 1000
                    ? `${(supply / 1000).toFixed(0)}K`
                    : supply.toFixed(0);
                ctx.fillText(formattedSupply, x, height - padding + 8);
            }

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);

            ctx.moveTo(currentX, currentY);
            ctx.lineTo(currentX, height - padding);

            ctx.moveTo(currentX, currentY);
            ctx.lineTo(padding, currentY);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;

            const width = rect.width;
            const padding = 40;

            if (mouseX >= padding && mouseX <= width - padding) {
                const maxDisplaySupply = Math.max(currentSupply * 1.5, 100);

                const t = (mouseX - padding) / (width - 2 * padding);
                const supply = t * t * maxDisplaySupply;
                const price = calculateCustomPrice(supply, startingPrice, growthRate);

                setHoverPoint({supply, price});
            } else {
                setHoverPoint(null);
            }
        };

        const handleMouseLeave = () => setHoverPoint(null);

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        drawChart();

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [currentSupply, maxSupply, startingPrice, growthRate, drawChart]);

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.2}}
        >
            <Card>
                <CardHeader className={previewMode ? "pb-2 py-2" : "pb-2"}>
                    <CardTitle className="text-lg">Bonding Curve</CardTitle>
                    {!previewMode && (
                        <CardDescription>
                            The price increases as more tokens are purchased
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className={previewMode ? "py-2" : ""}>
                    <div className="relative">
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={previewMode ? 200 : 300}
                            className="w-full h-auto"
                        />

                        {hoverPoint && !previewMode && (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                className="absolute top-2 right-2 bg-white/90 shadow-md rounded-md p-2 text-xs"
                            >
                                <p>
                                    <strong>Supply:</strong> {hoverPoint.supply.toLocaleString(undefined, {maximumFractionDigits: 0})} tokens
                                </p>
                                <p><strong>Price:</strong> {hoverPoint.price.toFixed(4)} ZTH</p>
                            </motion.div>
                        )}
                    </div>

                    {!previewMode && (
                        <>
                            <div className="flex justify-between items-center mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ec4899]"></div>
                                    <p>Current position</p>
                                </div>
                                <p className="font-medium">
                                    {calculateCustomPrice(currentSupply, startingPrice, growthRate).toFixed(4)} ZTH
                                </p>
                            </div>

                            <p className="text-xs text-muted-foreground mt-2">
                                Move your cursor over the chart to see prices at different supply levels
                            </p>
                        </>
                    )}

                    <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                        <p className="font-medium">Bonding Curve Parameters</p>
                        <p className="mt-1">Base Price: {startingPrice.toFixed(4)} ZTH</p>
                        <p className="mt-1">Growth Factor: {(growthRate * 100).toFixed(2)}% per token</p>
                        <p className="font-medium mt-2">Formula:</p>
                        <p className="font-mono mt-1">P = {startingPrice.toFixed(4)} × e<sup>{growthRate.toFixed(4)} × S</sup></p>
                        <p className="mt-1">Where P is the price and S is the supply</p>
                    </div>

                    {previewMode && (
                        <div className="mt-2 text-xs">
                            <p className="text-indigo-600 font-medium">Preview Mode</p>
                            <p className="mt-1">Adjust the sliders to see how the curve changes</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
