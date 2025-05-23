'use client';

import {useState, useTransition, useEffect, useRef} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {motion} from 'framer-motion';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {buyMemecoin, sellMemecoin} from '@/lib/trading.actions';
import {calculateBuyCost, calculateSellProceeds, calculatePrice} from '@/lib/trading.types';
import {Memecoin} from '@/lib/memecoin.types';

interface TradingInterfaceProps {
    memecoin: Memecoin;
    userBalance: number;
    userHoldings?: number;
    onTradeComplete?: (newSupply: number, newPrice: number, newUserBalance: number, newUserHoldings?: number) => void;
}

export function TradingInterface({memecoin, userBalance, userHoldings = 0, onTradeComplete}: TradingInterfaceProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [buyAmount, setBuyAmount] = useState<number>(1);
    const [sellAmount, setSellAmount] = useState<number>(1);
    const [buyCost, setBuyCost] = useState<number>(0);
    const [sellProceeds, setSellProceeds] = useState<number>(0);
    const [localUserHoldings, setLocalUserHoldings] = useState<number>(userHoldings);

    const isEffectRunning = useRef(false);

    const handleBuyAmountChange = (value: number) => {
        setBuyAmount(value);
        if (value > 0 && memecoin.supply >= 0) {
            const cost = calculateBuyCost(memecoin.supply, value, memecoin.startingPrice, memecoin.growthRate);
            setBuyCost(cost);
        } else {
            setBuyCost(0);
        }
    };

    const handleSellAmountChange = (value: number) => {
        setSellAmount(value);
        if (value > 0 && memecoin.supply >= value) {
            const proceeds = calculateSellProceeds(memecoin.supply, value, memecoin.startingPrice, memecoin.growthRate);
            setSellProceeds(proceeds);
        } else {
            setSellProceeds(0);
        }
    };

    useEffect(() => {
        if (!isEffectRunning.current) {
            isEffectRunning.current = true;

            if (buyAmount > 0 && memecoin.supply >= 0) {
                const cost = calculateBuyCost(memecoin.supply, buyAmount, memecoin.startingPrice, memecoin.growthRate);
                setBuyCost(cost);
            }

            if (sellAmount > 0 && memecoin.supply >= sellAmount) {
                const proceeds = calculateSellProceeds(memecoin.supply, sellAmount, memecoin.startingPrice, memecoin.growthRate);
                setSellProceeds(proceeds);
            }

            isEffectRunning.current = false;
        }
    }, [memecoin.supply, buyAmount, sellAmount, memecoin.startingPrice, memecoin.growthRate]);

    const handleBuy = () => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append('memecoinId', memecoin.id);
                formData.append('amount', buyAmount.toString());

                const result = await buyMemecoin(null, formData);

                if (result.success) {
                    toast.success(result.message);

                    const newSupply = memecoin.supply + buyAmount;
                    const newPrice = calculatePrice(newSupply, memecoin.startingPrice, memecoin.growthRate);
                    const newUserBalance = userBalance - buyCost;
                    const newUserHoldings = localUserHoldings + buyAmount;

                    setLocalUserHoldings(newUserHoldings);

                    if (onTradeComplete) {
                        onTradeComplete(newSupply, newPrice, newUserBalance, newUserHoldings);
                    }

                    router.refresh();
                } else {
                    toast.error(result.message);
                }
            } catch (error: unknown) {
                toast.error(error instanceof Error ? error.message : 'Failed to buy tokens. Please try again.');
            }
        });
    };

    const handleSell = () => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append('memecoinId', memecoin.id);
                formData.append('amount', sellAmount.toString());

                const result = await sellMemecoin(null, formData);

                if (result.success) {
                    toast.success(result.message);

                    const newSupply = memecoin.supply - sellAmount;
                    const newPrice = calculatePrice(newSupply, memecoin.startingPrice, memecoin.growthRate);
                    const newUserBalance = userBalance + sellProceeds;
                    const newUserHoldings = localUserHoldings - sellAmount;

                    setLocalUserHoldings(newUserHoldings);

                    if (onTradeComplete) {
                        onTradeComplete(newSupply, newPrice, newUserBalance, newUserHoldings);
                    }

                    router.refresh();
                } else {
                    toast.error(result.message);
                }
            } catch (error: unknown) {
                toast.error(error instanceof Error ? error.message : 'Failed to sell tokens. Please try again.');
            }
        });
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Trade {memecoin.symbol}</CardTitle>
                    <CardDescription>Buy or sell {memecoin.name} tokens</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="buy" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="buy" className="relative overflow-hidden group">
                                <motion.span
                                    className="relative z-10"
                                    whileTap={{scale: 0.95}}
                                >
                                    Buy
                                </motion.span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-data-[state=active]:opacity-100"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.3}}
                                />
                            </TabsTrigger>
                            <TabsTrigger value="sell" className="relative overflow-hidden group">
                                <motion.span
                                    className="relative z-10"
                                    whileTap={{scale: 0.95}}
                                >
                                    Sell
                                </motion.span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-data-[state=active]:opacity-100"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.3}}
                                />
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="buy" className="space-y-4">
                            <motion.div
                                className="space-y-2"
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.3}}
                            >
                                <Label htmlFor="buyAmount">Amount to buy</Label>
                                <Input
                                    id="buyAmount"
                                    type="number"
                                    min="1"
                                    value={buyAmount}
                                    onChange={(e) => handleBuyAmountChange(Number(e.target.value))}
                                    disabled={isPending}
                                    className="transition-all"
                                />
                            </motion.div>

                            <motion.div
                                className="rounded-lg bg-muted p-3"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.3, delay: 0.1}}
                            >
                                <motion.p
                                    className="text-sm font-medium"
                                    key={buyCost}
                                    initial={{scale: 0.95}}
                                    animate={{scale: 1}}
                                    transition={{duration: 0.2}}
                                >
                                    Cost: {buyCost.toFixed(4)} ZTH
                                </motion.p>
                                <p className="text-xs text-muted-foreground">Your
                                    balance: {userBalance.toFixed(4)} ZTH</p>
                            </motion.div>

                            <motion.div
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                            >
                                <Button
                                    onClick={handleBuy}
                                    disabled={isPending || buyCost > userBalance || buyAmount <= 0}
                                    className="w-full"
                                >
                                    {isPending ? 'Processing...' : 'Buy Tokens'}
                                </Button>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="sell" className="space-y-4">
                            <motion.div
                                className="space-y-2"
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.3}}
                            >
                                <Label htmlFor="sellAmount">Amount to sell</Label>
                                <Input
                                    id="sellAmount"
                                    type="number"
                                    min="1"
                                    max={memecoin.supply}
                                    value={sellAmount}
                                    onChange={(e) => handleSellAmountChange(Number(e.target.value))}
                                    disabled={isPending}
                                    className="transition-all"
                                />
                            </motion.div>

                            <motion.div
                                className="rounded-lg bg-muted p-3"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.3, delay: 0.1}}
                            >
                                <motion.p
                                    className="text-sm font-medium"
                                    key={sellProceeds}
                                    initial={{scale: 0.95}}
                                    animate={{scale: 1}}
                                    transition={{duration: 0.2}}
                                >
                                    You&apos;ll receive: {sellProceeds.toFixed(4)} ZTH
                                </motion.p>
                                <p className="text-xs text-muted-foreground">
                                    Your holdings: {localUserHoldings} tokens
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                            >
                                <Button
                                    onClick={handleSell}
                                    disabled={isPending || sellAmount > memecoin.supply || sellAmount <= 0}
                                    className="w-full"
                                >
                                    {isPending ? 'Processing...' : 'Sell Tokens'}
                                </Button>
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                    <p>Trading uses a bonding curve mechanism. The price changes based on supply.</p>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
