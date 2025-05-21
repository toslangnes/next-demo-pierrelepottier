'use client';

import {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {calculatePrice} from '@/lib/trading.types';

interface BondingCurveChartProps {
    currentSupply: number;
    maxSupply?: number;
}

export function BondingCurveChart({currentSupply, maxSupply = 10000000}: BondingCurveChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoverPoint, setHoverPoint] = useState<{supply: number, price: number} | null>(null);

    // Function to draw the chart
    const drawChart = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Set canvas dimensions with device pixel ratio for sharper rendering
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const width = rect.width;
        const height = rect.height;
        const padding = 40;
        
        // Generate points for the curve
        const points = [];
        const numPoints = 100;
        const maxDisplaySupply = Math.max(currentSupply * 2, maxSupply);
        
        for (let i = 0; i < numPoints; i++) {
            const supply = (i / (numPoints - 1)) * maxDisplaySupply;
            const price = calculatePrice(supply);
            points.push({supply, price});
        }
        
        const maxPrice = Math.max(...points.map(p => p.price)) * 1.1; // Add 10% margin
        
        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        
        // X-axis
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        
        // Y-axis
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(padding, padding);
        ctx.stroke();
        
        // Draw the curve
        ctx.beginPath();
        ctx.strokeStyle = '#8b5cf6'; // Purple
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
        
        // Fill area under curve
        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.fill();
        
        // Draw current position marker
        const currentX = padding + (currentSupply / maxDisplaySupply) * (width - 2 * padding);
        const currentY = height - padding - (calculatePrice(currentSupply) / maxPrice) * (height - 2 * padding);
        
        ctx.beginPath();
        ctx.arc(currentX, currentY, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#ec4899'; // Pink
        ctx.fill();
        
        // Draw labels
        ctx.font = '12px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        
        // X-axis label
        ctx.fillText('Supply', width / 2, height - 5);
        
        // Y-axis label
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Price (ZTH)', 0, 0);
        ctx.restore();
        
        // Draw dashed lines from current position to axes
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        
        // Vertical line to x-axis
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(currentX, height - padding);
        
        // Horizontal line to y-axis
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(padding, currentY);
        ctx.stroke();
        ctx.setLineDash([]);
    };
    
    // Draw the chart when component mounts or when currentSupply changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Set up mouse event listeners
        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            
            // Convert mouse position to chart coordinates
            const width = rect.width;
            const padding = 40;
            
            // Check if mouse is within chart area
            if (mouseX >= padding && mouseX <= width - padding) {
                // Calculate supply and price at mouse position
                const maxDisplaySupply = Math.max(currentSupply * 2, maxSupply);
                const supply = ((mouseX - padding) / (width - 2 * padding)) * maxDisplaySupply;
                const price = calculatePrice(supply);

                setHoverPoint({ supply, price });
            } else {
                setHoverPoint(null);
            }
        };

        const handleMouseLeave = () => setHoverPoint(null);

        // Add event listeners
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        
        // Draw the chart
        drawChart();

        // Cleanup
        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [currentSupply, maxSupply]);

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.2}}
        >
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Bonding Curve</CardTitle>
                    <CardDescription>
                        The price increases as more tokens are purchased
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={300}
                            className="w-full h-auto"
                        />
                        
                        {/* Hover tooltip */}
                        {hoverPoint && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute top-2 right-2 bg-white/90 shadow-md rounded-md p-2 text-xs"
                            >
                                <p><strong>Supply:</strong> {hoverPoint.supply.toLocaleString(undefined, {maximumFractionDigits: 0})} tokens</p>
                                <p><strong>Price:</strong> {hoverPoint.price.toFixed(4)} ZTH</p>
                            </motion.div>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ec4899]"></div>
                            <p>Current position</p>
                        </div>
                        <p className="font-medium">
                            {calculatePrice(currentSupply).toFixed(4)} ZTH
                        </p>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                        Move your cursor over the chart to see prices at different supply levels
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}