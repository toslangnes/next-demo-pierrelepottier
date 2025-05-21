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