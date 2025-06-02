'use client';
import {Memecoin} from "@/lib/types/memecoin.types";
import Link from 'next/link';
import MemecoinImage from './MemecoinImage.client';
import { ArrowUpRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function SimpleMemecoinItem({coin}: { coin: Memecoin }) {
    return (
        <div className="w-full bg-gradient-to-br from-white to-indigo-50 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md p-4">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                    <MemecoinImage
                        logoUrl={coin.logoUrl}
                        symbol={coin.symbol}
                        size="small"
                    />
                </div>

                <div className="flex-grow min-w-0">
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-lg truncate text-gray-800">{coin.name}</h3>
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit">{coin.symbol}</span>
                    </div>
                </div>

                <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-indigo-600">{coin.price.toFixed(4)} ZTH</p>
                </div>
            </div>

            <div className="mt-4">
                <Button asChild variant="default" className="text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 w-full shadow-sm">
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
