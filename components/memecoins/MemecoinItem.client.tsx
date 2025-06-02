'use client';
import {Memecoin} from "@/lib/types/memecoin.types";
import Link from 'next/link';
import MemecoinImage from './MemecoinImage.client';
import { ArrowUpRight, TrendingUp, Coins } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function MemecoinItem({coin}: { coin: Memecoin }) {

    return (
        <div className="w-full bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                    <MemecoinImage
                        logoUrl={coin.logoUrl}
                        symbol={coin.symbol}
                        size="small"
                    />
                </div>

                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                        <Link href={`/memecoins/${coin.id}`} className="hover:underline">
                            <h3 className="font-medium text-lg truncate">{coin.name}</h3>
                        </Link>
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{coin.symbol}</span>
                    </div>

                    <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4 text-indigo-500" />
                            <span className="text-sm">Supply: {coin.supply.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-indigo-500" />
                            <span className="text-sm">Growth: {(coin.growthRate * 100).toFixed(2)}%</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-right">
                        <p className="text-lg font-bold text-indigo-600">{coin.price.toFixed(4)} ZTH</p>
                    </div>
                    <Button asChild variant="default" className="text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 px-4 py-2 w-full shadow-sm">
                        <Link href={`/memecoins/${coin.id}`}>
                            <span className="flex items-center justify-center gap-2">
                                Trade Now
                                <ArrowUpRight className="h-4 w-4" />
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
