'use client';
import { Memecoin } from "@/lib/memecoin.types";
import {Card} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default function MemecoinItem({coin}: { coin: Memecoin }) {

    return (
        <Link href={`/memecoins/${coin.id}`}>
            <Card className="p-4 flex flex-col gap-2 hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-3 mb-1">
                    {coin.logoUrl && (<Image src={coin.logoUrl} alt="logo" width={48} height={48} className="rounded-full"/>)}
                    <div>
                        <h3 className="font-medium line-clamp-1">{coin.name}</h3>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">{coin.symbol}</span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{coin.description}</p>
                <p className="mt-auto text-sm font-semibold">💰 {coin.price.toFixed(4)} ZTH</p>
            </Card>
        </Link>
    );
}
