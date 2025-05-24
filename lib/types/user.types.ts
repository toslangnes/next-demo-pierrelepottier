import {z} from "zod";

const num = z.coerce.number();

export const userSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().email(),
    password: z.string(),
    zthBalance: num.default(100),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

export const updateProfileSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    currentPassword: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),
    confirmPassword: z.string().min(6).optional(),
}).refine(async data => {
    const hasCurrentPassword = !!data.currentPassword;
    const hasNewPassword = !!data.newPassword;
    const hasConfirmPassword = !!data.confirmPassword;

    if (hasCurrentPassword || hasNewPassword || hasConfirmPassword) {
        return hasCurrentPassword && hasNewPassword && hasConfirmPassword;
    }

    return true;
}, {
    message: "All password fields are required when changing password",
    path: ["currentPassword"],
}).refine(async data => {
    if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
    }
    return true;
}, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
});

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
