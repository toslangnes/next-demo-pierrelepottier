"use server";

import {cache} from "react";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {createMemecoinSchema, Memecoin,} from "@/lib/memecoin.types";
import {prisma} from "@/lib/prisma";
import "server-only";

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
): Promise<{ success: true }> {
    try {
        const payload = createMemecoinSchema.parse({
            name: formData.get("name"),
            symbol: formData.get("symbol"),
            description: formData.get("description") ?? undefined,
            logoUrl: formData.get("logoUrl") ?? undefined,
        });

        await prisma.memecoin.create({
            data: {
                ...payload,
                price: Math.random() * 0.01,
                supply: Math.floor(Math.random() * 10000000) + 1000000,
            }
        });

        revalidatePath("/memecoins");
        return {success: true};
    } catch (error) {
        console.error("Error in createMemecoin:", error);
        if (error instanceof z.ZodError) {
            throw new Error("Données de formulaire invalides. Veuillez vérifier vos entrées.");
        }
        throw new Error("Impossible de créer le memecoin. Veuillez réessayer plus tard.");
    }
}

export async function deleteMemecoin(id: string): Promise<{ success: true }> {
    if (!id) throw new Error("ID is required");

    try {
        await prisma.memecoin.delete({
            where: {id}
        });

        revalidatePath("/memecoins");
        return {success: true};
    } catch (error) {
        console.error(`Error deleting memecoin ${id}:`, error);
        throw new Error("Impossible de supprimer le memecoin. Veuillez réessayer plus tard.");
    }
}
