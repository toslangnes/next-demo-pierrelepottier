'use client';

import {useState} from 'react';
import {BondingCurveChart} from '@/components/memecoins/BondingCurveChart';
import {TradingInterface} from '@/components/memecoins/TradingInterface';
import {Memecoin} from '@/lib/types/memecoin.types';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {LogIn} from 'lucide-react';

interface MemecoinTradingProps {
    memecoin: Memecoin;
    userBalance: number;
    userHoldings: number;
    isLoggedIn: boolean;

}

export default function MemecoinTrading({memecoin, userBalance, userHoldings, isLoggedIn}: MemecoinTradingProps) {
    const [currentSupply, setCurrentSupply] = useState<number>(memecoin.supply);
    const [currentPrice, setCurrentPrice] = useState<number>(memecoin.price);
    const [localUserBalance, setLocalUserBalance] = useState<number>(userBalance);
    const [localUserHoldings, setLocalUserHoldings] = useState<number>(userHoldings);

    const onTradeComplete = (newSupply: number, newPrice: number, newUserBalance: number, newUserHoldings?: number) => {
        setCurrentSupply(newSupply);
        setCurrentPrice(newPrice);
        setLocalUserBalance(newUserBalance);
        if (newUserHoldings !== undefined) {
            setLocalUserHoldings(newUserHoldings);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BondingCurveChart
                currentSupply={currentSupply}
                startingPrice={memecoin.startingPrice}
                growthRate={memecoin.growthRate}
            />
            {isLoggedIn ? (
                <TradingInterface
                    memecoin={{...memecoin, supply: currentSupply, price: currentPrice}}
                    userBalance={localUserBalance}
                    userHoldings={localUserHoldings}
                    onTradeComplete={onTradeComplete}
                />
            ) : (
                <div className="text-center p-6 bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
                    <p className="text-lg">Login to buy or sell {memecoin.symbol} tokens</p>
                    <Button asChild className="flex items-center gap-2">
                        <Link href="/login">
                            <LogIn className="h-4 w-4"/>
                            Login
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
