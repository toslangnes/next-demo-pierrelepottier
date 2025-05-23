import {z} from "zod";

export const GROWTH_RATE = 0.005;
export const STARTING_PRICE = 0.1;

export const tradeSchema = z.object({
    memecoinId: z.string(),
    amount: z.number().positive("Amount must be positive")
});
export type TradePayload = z.infer<typeof tradeSchema>;

export type TradeResponse = {
    success: boolean;
    message: string;
    userHoldings?: number;
    cost?: number;
    proceeds?: number;
};

export function calculatePrice(supply: number, startingPrice = STARTING_PRICE, growthRate = GROWTH_RATE): number {
    return startingPrice * Math.exp(growthRate * supply);
}

export function calculateBuyCost(supply: number, amount: number, startingPrice = STARTING_PRICE, growthRate = GROWTH_RATE): number {
    return (startingPrice / growthRate) * (Math.exp(growthRate * (supply + amount)) - Math.exp(growthRate * supply));
}

export function calculateSellProceeds(supply: number, amount: number, startingPrice = STARTING_PRICE, growthRate = GROWTH_RATE): number {
    return (startingPrice / growthRate) * (Math.exp(growthRate * supply) - Math.exp(growthRate * (supply - amount)));
}
