'use client';
import { Memecoin } from "@/lib/memecoin.types";
import {Card} from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MemecoinImage from './MemecoinImage.client';

export default function MemecoinItem({coin}: { coin: Memecoin }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link href={`/memecoins/${coin.id}`}>
                <Card className="p-4 flex flex-col gap-2 hover:shadow-md transition-all h-full">
                    <div className="flex items-center gap-3 mb-2">
                        <motion.div whileHover={{ rotate: 10 }}>
                            <MemecoinImage 
                                logoUrl={coin.logoUrl} 
                                symbol={coin.symbol} 
                                size="small" 
                            />
                        </motion.div>
                        <div>
                            <h3 className="font-medium line-clamp-1 text-lg">{coin.name}</h3>
                            <span className="text-xs bg-muted px-2 py-0.5 rounded">{coin.symbol}</span>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{coin.description}</p>
                    <motion.p 
                        className="mt-auto text-sm font-semibold"
                        whileHover={{ scale: 1.05 }}
                    >
                        💰 {coin.price.toFixed(4)} ZTH
                    </motion.p>
                </Card>
            </Link>
        </motion.div>
    );
}
