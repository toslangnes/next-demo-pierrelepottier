import {z} from "zod";

export const SLOPE = 0.00001;
export const STARTING_PRICE = 0.001;

export const tradeSchema = z.object({
    memecoinId: z.string(),
    amount: z.number().positive("Amount must be positive")
});
export type TradePayload = z.infer<typeof tradeSchema>;

export type TradeResponse = {
    success: boolean;
    message: string;
};

export function calculatePrice(supply: number): number {
    return SLOPE * supply + STARTING_PRICE;
}

export function calculateBuyCost(supply: number, amount: number): number {
    return SLOPE * ((amount + supply) ** 2 - supply ** 2) / 2 + amount * STARTING_PRICE;
}

export function calculateSellProceeds(supply: number, amount: number): number {
    return SLOPE * (supply ** 2 - (supply - amount) ** 2) / 2 + amount * STARTING_PRICE;
}
