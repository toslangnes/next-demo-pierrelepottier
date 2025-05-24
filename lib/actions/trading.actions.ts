"use server";

import {revalidatePath} from "next/cache";
import {prisma} from "@/lib/prisma";
import {auth} from "@/app/auth";
import {z} from "zod";
import {
    calculatePrice,
    calculateBuyCost,
    calculateSellProceeds,
    tradeSchema,
    TradeResponse
} from "@/lib/types/trading.types";

export async function buyMemecoin(
    _prev: unknown,
    formData: FormData
): Promise<TradeResponse> {
    try {
        const session = await auth();
        if (!session?.user) {
            return {success: false, message: "You must be logged in to buy memecoins"};
        }

        const userId = session.user.id;

        const payload = tradeSchema.parse({
            memecoinId: formData.get("memecoinId"),
            amount: Number(formData.get("amount"))
        });

        const {memecoinId, amount} = payload;

        const result = await prisma.$transaction(async (tx) => {
            const memecoin = await tx.memecoin.findUnique({
                where: {id: memecoinId}
            });

            if (!memecoin) {
                return {success: false, message: "Memecoin not found"};
            }

            const user = await tx.user.findUnique({
                where: {id: userId}
            });

            if (!user) {
                return {success: false, message: "User not found"};
            }

            const cost = calculateBuyCost(memecoin.supply, amount, memecoin.startingPrice, memecoin.growthRate);

            if (user.zthBalance < cost) {
                return {success: false, message: "Insufficient ZTH balance"};
            }

            const userTransactions = await tx.transaction.findMany({
                where: {
                    userId: userId,
                    memecoinId: memecoinId
                }
            });

            let userHoldings = 0;
            for (const txn of userTransactions) {
                if (txn.type === "BUY" && txn.quantity) {
                    userHoldings += txn.quantity;
                } else if (txn.type === "SELL" && txn.quantity) {
                    userHoldings -= txn.quantity;
                }
            }

            const newSupply = memecoin.supply + amount;
            const newPrice = calculatePrice(newSupply, memecoin.startingPrice, memecoin.growthRate);

            await tx.user.update({
                where: {id: user.id},
                data: {zthBalance: user.zthBalance - cost}
            });

            await tx.memecoin.update({
                where: {id: memecoinId},
                data: {
                    supply: newSupply,
                    price: newPrice,
                    reserve: memecoin.reserve + cost
                }
            });

            await tx.transaction.create({
                data: {
                    type: "BUY",
                    amount: cost,
                    quantity: amount,
                    userId: user.id,
                    memecoinId: memecoinId
                }
            });

            return {
                success: true,
                message: `Successfully bought ${amount} tokens for ${cost.toFixed(4)} ZTH`,
                userHoldings: userHoldings + amount,
                cost
            };
        });

        if (!result.success) {
            return result;
        }

        revalidatePath(`/memecoins/${memecoinId}`);
        revalidatePath('/portfolio');
        return result;
    } catch (error) {
        console.error("Error buying memecoin:", error);
        if (error instanceof z.ZodError) {
            return {success: false, message: "Invalid input data"};
        }
        return {success: false, message: "Failed to buy memecoin. Please try again."};
    }
}

export async function sellMemecoin(
    _prev: unknown,
    formData: FormData
): Promise<TradeResponse> {
    try {
        const session = await auth();
        if (!session?.user) {
            return {success: false, message: "You must be logged in to sell memecoins"};
        }

        const userId = session.user.id;

        const payload = tradeSchema.parse({
            memecoinId: formData.get("memecoinId"),
            amount: Number(formData.get("amount"))
        });

        const {memecoinId, amount} = payload;

        const result = await prisma.$transaction(async (tx) => {
            const memecoin = await tx.memecoin.findUnique({
                where: {id: memecoinId}
            });

            if (!memecoin) {
                return {success: false, message: "Memecoin not found"};
            }

            if (memecoin.supply < amount) {
                return {success: false, message: "Not enough tokens in circulation"};
            }

            const user = await tx.user.findUnique({
                where: {id: userId}
            });

            if (!user) {
                return {success: false, message: "User not found"};
            }

            const userTransactions = await tx.transaction.findMany({
                where: {
                    userId: userId,
                    memecoinId: memecoinId
                }
            });

            let userHoldings = 0;
            for (const txn of userTransactions) {
                if (txn.type === "BUY" && txn.quantity) {
                    userHoldings += txn.quantity;
                } else if (txn.type === "SELL" && txn.quantity) {
                    userHoldings -= txn.quantity;
                }
            }

            if (userHoldings < amount) {
                return {success: false, message: `You only own ${userHoldings} tokens of this memecoin`};
            }

            const proceeds = calculateSellProceeds(memecoin.supply, amount, memecoin.startingPrice, memecoin.growthRate);

            if (memecoin.reserve < proceeds) {
                return {success: false, message: "Insufficient reserve in the liquidity pool"};
            }

            const newSupply = memecoin.supply - amount;
            const newPrice = calculatePrice(newSupply, memecoin.startingPrice, memecoin.growthRate);

            await tx.user.update({
                where: {id: user.id},
                data: {zthBalance: user.zthBalance + proceeds}
            });

            await tx.memecoin.update({
                where: {id: memecoinId},
                data: {
                    supply: newSupply,
                    price: newPrice,
                    reserve: memecoin.reserve - proceeds
                }
            });

            await tx.transaction.create({
                data: {
                    type: "SELL",
                    amount: proceeds,
                    quantity: amount,
                    userId: user.id,
                    memecoinId: memecoinId
                }
            });

            return {
                success: true,
                message: `Successfully sold ${amount} tokens for ${proceeds.toFixed(4)} ZTH`,
                userHoldings: userHoldings - amount,
                proceeds
            };
        });

        if (!result.success) {
            return result;
        }

        revalidatePath(`/memecoins/${memecoinId}`);
        revalidatePath('/portfolio');
        return result;
    } catch (error) {
        console.error("Error selling memecoin:", error);
        if (error instanceof z.ZodError) {
            return {success: false, message: "Invalid input data"};
        }
        return {success: false, message: "Failed to sell memecoin. Please try again."};
    }
}
