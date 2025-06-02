"use server";

import {cache} from "react";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {createMemecoinSchema, Memecoin} from "@/lib/types/memecoin.types";
import {prisma} from "@/lib/prisma";
import "server-only";
import {auth} from "@/app/auth";

export const getUserCreatedMemecoins = cache(async (userId: string): Promise<Memecoin[]> => {
    try {
        const memecoins = await prisma.memecoin.findMany({
            where: {userId: userId},
            orderBy: {createdAt: "desc"}
        });

        return memecoins;
    } catch (error: unknown) {
        console.error("Error fetching user created memecoins:", error);
        throw new Error("Failed to fetch user created memecoins. Please try again.");
    }
});

export const getUserPurchasedMemecoins = cache(async (userId: string, createdMemecoinIds: string[]): Promise<Memecoin[]> => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: userId,
                type: "BUY",
                NOT: {memecoinId: null}
            },
            include: {memecoin: true}
        });

        const purchasedMemecoinIds = new Set<string>();
        transactions.forEach(tx => {
            if (tx.memecoinId && !createdMemecoinIds.includes(tx.memecoinId)) {
                purchasedMemecoinIds.add(tx.memecoinId);
            }
        });

        const purchasedMemecoins = await prisma.memecoin.findMany({
            where: {
                id: {in: Array.from(purchasedMemecoinIds)}
            },
            orderBy: {updatedAt: "desc"}
        });

        return purchasedMemecoins;
    } catch (error: unknown) {
        console.error("Error fetching user purchased memecoins:", error);
        throw new Error("Failed to fetch user purchased memecoins. Please try again.");
    }
});

export const getMemecoins = cache(async (searchTerm?: string): Promise<Memecoin[]> => {
    try {
        let whereClause = {};

        if (searchTerm && searchTerm.trim() !== '') {
            whereClause = {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { symbol: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } }
                ]
            };
        }

        const memecoins = await prisma.memecoin.findMany({
            where: whereClause,
            orderBy: {createdAt: "desc"}
        });

        return memecoins;
    } catch (error: unknown) {
        console.error("Error fetching memecoins:", error);
        throw new Error("Impossible de récupérer les memecoins. Veuillez réessayer plus tard.");
    }
});

export const getMemecoin = cache(async (id: string): Promise<Memecoin> => {
    if (!id) throw new Error("ID is required");

    try {
        const memecoin = await prisma.memecoin.findUnique({
            where: {id}
        });

        if (!memecoin) {
            throw new Error("NOT_FOUND");
        }

        return memecoin;
    } catch (error: unknown) {
        console.error(`Error fetching memecoin ${id}:`, error);
        if (error instanceof Error && error.message === "NOT_FOUND") {
            throw error;
        }
        throw new Error("Impossible de récupérer le memecoin. Veuillez réessayer plus tard.");
    }
});

export async function createMemecoin(
    _prev: unknown,
    formData: FormData,
): Promise<{ success: boolean; message?: string }> {
    try {
        const session = await auth();
        if (!session?.user) {
            return { success: false, message: "You must be logged in to create a memecoin" };
        }

        const payload = createMemecoinSchema.parse({
            name: formData.get("name"),
            symbol: formData.get("symbol"),
            description: formData.get("description") ?? undefined,
            logoUrl: formData.get("logoUrl") ?? undefined,
            startingPrice: (() => {
                const value = formData.get("startingPrice");
                return value ? Number(value) : undefined;
            })(),
            growthRate: (() => {
                const value = formData.get("growthRate");
                return value ? Number(value) : undefined;
            })(),
        });

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            return { success: false, message: "User not found" };
        }

        if (user.zthBalance < 1) {
            return { success: false, message: "Insufficient ZTH balance. You need 1 ZTH to create a memecoin." };
        }

        const initialSupply = 0;
        const initialPrice = payload.startingPrice ?? 0.1;
        const growthRate = payload.growthRate ?? 0.005;

        const newMemecoin = await prisma.memecoin.create({
            data: {
                ...payload,
                price: initialPrice,
                supply: initialSupply,
                reserve: 0,
                startingPrice: initialPrice,
                growthRate: growthRate,
                userId: user.id,
                owner: user.name ?? user.email,
            }
        });

        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { zthBalance: user.zthBalance - 1 }
            }),
            prisma.transaction.create({
                data: {
                    type: "CREATE",
                    amount: 1,
                    quantity: 0,
                    userId: user.id,
                    memecoinId: newMemecoin.id
                }
            })
        ]);

        revalidatePath("/memecoins");
        return { success: true };
    } catch (error: unknown) {
        console.error("Error in createMemecoin:", error);
        if (error instanceof z.ZodError) {
            return { success: false, message: "Données de formulaire invalides. Veuillez vérifier vos entrées." };
        }
        return { success: false, message: "Impossible de créer le memecoin. Veuillez réessayer plus tard." };
    }
}
