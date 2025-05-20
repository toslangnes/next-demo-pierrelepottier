'use client';
import {useEffect, useState} from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import {getMemecoin} from "@/lib/memecoin.actions";

type Point = { t: number; p: number };

export default function PriceChart({memecoinId}: { memecoinId: string }) {
    const [data, setData] = useState<Point[]>([]);
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        async function fetchHistory() {
            try {
                const memecoin = await getMemecoin(memecoinId);
                setData((d) => [...d.slice(-49), {t: Date.now(), p: memecoin.price}]);
            } catch (error) {
                console.error("Error fetching memecoin:", error);
                // If the memecoin is not found, clear the interval to stop further requests
                if (error instanceof Error && error.message === "NOT_FOUND" && intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            }
        }

        fetchHistory();
        intervalId = setInterval(fetchHistory, 5000);
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [memecoinId]);

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{top: 10, right: 20, left: 0, bottom: 0}}>
                <XAxis dataKey="t" hide domain={['auto', 'auto']} type="number"/>
                <YAxis dataKey="p" width={40}/>
                <Tooltip labelFormatter={(t) => new Date(t as number).toLocaleTimeString()}/>
                <Line dataKey="p" strokeWidth={2} dot={false} isAnimationActive={false}/>
            </LineChart>
        </ResponsiveContainer>
    );
}
