'use client';
import {Memecoin} from "@/lib/memecoin.types";
import Link from 'next/link';
import MemecoinImage from './MemecoinImage.client';
import { ArrowUpRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function SimpleMemecoinItem({coin}: { coin: Memecoin }) {
    return (
        <div className="w-full bg-white rounded-lg border border-gray-100 shadow-sm transition-all p-3">
            <div className="flex items-center gap-3">
                {/* Left section - Logo */}
                <div className="flex-shrink-0">
                    <MemecoinImage
                        logoUrl={coin.logoUrl}
                        symbol={coin.symbol}
                        size="small"
                    />
                </div>

                {/* Middle section - Name and symbol only */}
                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg truncate">{coin.name}</h3>
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{coin.symbol}</span>
                    </div>
                </div>

                {/* Right section - Price only */}
                <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-indigo-600">{coin.price.toFixed(4)} ZTH</p>
                </div>
            </div>
            
            {/* Button below */}
            <div className="mt-3">
                <Button asChild variant="default" className="text-white bg-indigo-600 hover:bg-indigo-700 w-full">
                    <Link href={`/memecoins/${coin.id}`}>
                        <span className="flex items-center justify-center gap-2">
                            Trade Now
                            <ArrowUpRight className="h-4 w-4" />
                        </span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}