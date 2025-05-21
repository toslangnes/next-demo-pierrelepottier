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
} from "@/lib/trading.types";
import {User} from "@/lib/user.types";
import {Memecoin} from "@/lib/memecoin.types";

export async function buyMemecoin(
    _prev: unknown,
    formData: FormData
): Promise<TradeResponse> {
    try {
        const session = await auth();
        if (!session?.user) {
            return {success: false, message: "You must be logged in to buy memecoins"};
        }

        const payload = tradeSchema.parse({
            memecoinId: formData.get("memecoinId"),
            amount: Number(formData.get("amount"))
        });

        const {memecoinId, amount} = payload;

        const memecoin = await prisma.memecoin.findUnique({
            where: {id: memecoinId}
        }) as Memecoin;

        if (!memecoin) {
            return {success: false, message: "Memecoin not found"};
        }

        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        }) as User;

        if (!user) {
            return {success: false, message: "User not found"};
        }

        const cost = calculateBuyCost(memecoin.supply, amount);

        if (user.zthBalance < cost) {
            return {success: false, message: "Insufficient ZTH balance"};
        }

        // Update user balance, memecoin supply, price, and reserve
        const newSupply = memecoin.supply + amount;
        const newPrice = calculatePrice(newSupply);

        // Execute transaction in a Prisma transaction
        await prisma.$transaction([
            // Update user balance
            prisma.user.update({
                where: {id: user.id},
                data: {zthBalance: user.zthBalance - cost}
            }),
            // Update memecoin
            prisma.memecoin.update({
                where: {id: memecoinId},
                data: {
                    supply: newSupply,
                    price: newPrice,
                    reserve: memecoin.reserve + cost
                }
            }),
            // Create transaction record
            prisma.transaction.create({
                data: {
                    type: "BUY",
                    amount: cost,
                    quantity: amount,
                    userId: user.id,
                    memecoinId: memecoinId
                }
            })
        ]);

        revalidatePath(`/memecoins/${memecoinId}`);
        revalidatePath('/portfolio');
        return {success: true, message: `Successfully bought ${amount} tokens for ${cost.toFixed(4)} ZTH`};
    } catch (error) {
        console.error("Error buying memecoin:", error);
        if (error instanceof z.ZodError) {
            return {success: false, message: "Invalid input data"};
        }
        return {success: false, message: "Failed to buy memecoin. Please try again."};
    }
}

// Sell memecoin tokens
export async function sellMemecoin(
    _prev: unknown,
    formData: FormData
): Promise<TradeResponse> {
    try {
        const session = await auth();
        if (!session?.user) {
            return {success: false, message: "You must be logged in to sell memecoins"};
        }

        const payload = tradeSchema.parse({
            memecoinId: formData.get("memecoinId"),
            amount: Number(formData.get("amount"))
        });

        const {memecoinId, amount} = payload;

        // Get the memecoin
        const memecoin = await prisma.memecoin.findUnique({
            where: {id: memecoinId}
        }) as Memecoin;

        if (!memecoin) {
            return {success: false, message: "Memecoin not found"};
        }

        // Check if there's enough supply to sell
        if (memecoin.supply < amount) {
            return {success: false, message: "Not enough tokens in circulation"};
        }

        // Calculate proceeds
        const proceeds = calculateSellProceeds(memecoin.supply, amount);

        // Check if reserve has enough ZTH
        if (memecoin.reserve < proceeds) {
            return {success: false, message: "Insufficient reserve in the liquidity pool"};
        }

        // Get the user
        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        }) as User;

        if (!user) {
            return {success: false, message: "User not found"};
        }

        // Update user balance, memecoin supply, price, and reserve
        const newSupply = memecoin.supply - amount;
        const newPrice = calculatePrice(newSupply);

        // Execute transaction in a Prisma transaction
        await prisma.$transaction([
            // Update user balance
            prisma.user.update({
                where: {id: user.id},
                data: {zthBalance: user.zthBalance + proceeds}
            }),
            // Update memecoin
            prisma.memecoin.update({
                where: {id: memecoinId},
                data: {
                    supply: newSupply,
                    price: newPrice,
                    reserve: memecoin.reserve - proceeds
                }
            }),
            // Create transaction record
            prisma.transaction.create({
                data: {
                    type: "SELL",
                    amount: proceeds,
                    quantity: amount,
                    userId: user.id,
                    memecoinId: memecoinId
                }
            })
        ]);

        revalidatePath(`/memecoins/${memecoinId}`);
        revalidatePath('/portfolio');
        return {success: true, message: `Successfully sold ${amount} tokens for ${proceeds.toFixed(4)} ZTH`};
    } catch (error) {
        console.error("Error selling memecoin:", error);
        if (error instanceof z.ZodError) {
            return {success: false, message: "Invalid input data"};
        }
        return {success: false, message: "Failed to sell memecoin. Please try again."};
    }
}
