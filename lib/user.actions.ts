"use server";

import {revalidatePath} from "next/cache";
import {prisma} from "@/lib/prisma";
import {auth} from "@/app/auth";
import {z} from "zod";
import * as bcrypt from 'bcryptjs';
import {updateProfileSchema} from "@/lib/user.types";

export async function updateProfile(
    _prev: unknown,
    formData: FormData
): Promise<{ success: boolean; message: string }> {
    try {
        const session = await auth();
        if (!session?.user) {
            return {success: false, message: "You must be logged in to update your profile"};
        }

        const userId = session.user.id;

        const payload = await updateProfileSchema.parseAsync({
            name: formData.get("name") || undefined,
            email: formData.get("email") || undefined,
            currentPassword: formData.get("currentPassword") || undefined,
            newPassword: formData.get("newPassword") || undefined,
            confirmPassword: formData.get("confirmPassword") || undefined,
        });

        const user = await prisma.user.findUnique({
            where: {id: userId}
        });

        if (!user) {
            return {success: false, message: "User not found"};
        }

        const updateData: {
            name?: string;
            email?: string;
            password?: string;
        } = {};

        if (payload.name) {
            updateData.name = payload.name;
        }

        if (payload.email) {
            const existingUser = await prisma.user.findUnique({
                where: {email: payload.email}
            });

            if (existingUser && existingUser.id !== userId) {
                return {success: false, message: "Email is already in use"};
            }

            updateData.email = payload.email;
        }

        if (payload.currentPassword && payload.newPassword) {
            const isPasswordValid = await bcrypt.compare(payload.currentPassword, user.password);

            if (!isPasswordValid) {
                return {success: false, message: "Current password is incorrect"};
            }

            updateData.password = await bcrypt.hash(payload.newPassword, 10);
        }

        await prisma.user.update({
            where: {id: userId},
            data: updateData
        });

        revalidatePath('/profile');
        return {success: true, message: "Profile updated successfully"};
    } catch (error) {
        console.error("Error updating profile:", error);
        if (error instanceof z.ZodError) {
            return {success: false, message: "Invalid input data"};
        }
        return {success: false, message: "Failed to update profile. Please try again."};
    }
}
