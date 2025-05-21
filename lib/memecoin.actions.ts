"use server";

import {cache} from "react";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {createMemecoinSchema, Memecoin,} from "@/lib/memecoin.types";
import {prisma} from "@/lib/prisma";
import "server-only";
import {auth} from "@/app/auth";

export const getMemecoins = cache(async (): Promise<Memecoin[]> => {
    try {
        return await prisma.memecoin.findMany({
            orderBy: {createdAt: 'desc'}
        });
    } catch (error) {
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
    } catch (error) {
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
        // Get the current user
        const session = await auth();
        if (!session?.user) {
            return { success: false, message: "You must be logged in to create a memecoin" };
        }

        const payload = createMemecoinSchema.parse({
            name: formData.get("name"),
            symbol: formData.get("symbol"),
            description: formData.get("description") ?? undefined,
            logoUrl: formData.get("logoUrl") ?? undefined,
        });

        // Get the user to check balance
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Check if user has enough ZTH (1 ZTH required to create a memecoin)
        if (user.zthBalance < 1) {
            return { success: false, message: "Insufficient ZTH balance. You need 1 ZTH to create a memecoin." };
        }

        // Initial supply and price
        const initialSupply = 1000000;
        const initialPrice = 0.01;

        // Execute transaction in a Prisma transaction
        await prisma.$transaction([
            // Create the memecoin
            prisma.memecoin.create({
                data: {
                    ...payload,
                    price: initialPrice,
                    supply: initialSupply,
                    reserve: 0,
                    userId: user.id,
                    owner: user.name || user.email,
                }
            }),
            // Deduct 1 ZTH from user's balance
            prisma.user.update({
                where: { id: user.id },
                data: { zthBalance: user.zthBalance - 1 }
            }),
            // Create a transaction record
            prisma.transaction.create({
                data: {
                    type: "CREATE",
                    amount: 1, // 1 ZTH cost
                    userId: user.id,
                }
            })
        ]);

        revalidatePath("/memecoins");
        return { success: true };
    } catch (error) {
        console.error("Error in createMemecoin:", error);
        if (error instanceof z.ZodError) {
            throw new Error("Données de formulaire invalides. Veuillez vérifier vos entrées.");
        }
        throw new Error("Impossible de créer le memecoin. Veuillez réessayer plus tard.");
    }
}

export async function deleteMemecoin(id: string): Promise<{ success: boolean; message?: string }> {
    if (!id) throw new Error("ID is required");

    try {
        // Get the current user
        const session = await auth();
        if (!session?.user) {
            return { success: false, message: "You must be logged in to delete a memecoin" };
        }

        // Get the memecoin to check ownership
        const memecoin = await prisma.memecoin.findUnique({
            where: { id }
        });

        if (!memecoin) {
            return { success: false, message: "Memecoin not found" };
        }

        // Check if the user is the owner of the memecoin
        if (memecoin.userId !== session.user.id) {
            return { success: false, message: "You can only delete memecoins that you created" };
        }

        // Delete the memecoin
        await prisma.memecoin.delete({
            where: { id }
        });

        revalidatePath("/memecoins");
        return { success: true };
    } catch (error) {
        console.error(`Error deleting memecoin ${id}:`, error);
        throw new Error("Impossible de supprimer le memecoin. Veuillez réessayer plus tard.");
    }
}
