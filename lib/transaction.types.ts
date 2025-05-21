import {z} from "zod";

const num = z.coerce.number();

export const transactionSchema = z.object({
    id: z.string(),
    type: z.string(),
    amount: num,
    quantity: num.nullable().optional(),
    userId: z.string(),
    memecoinId: z.string().nullable().optional(),
    createdAt: z.date(),
});

export type Transaction = z.infer<typeof transactionSchema>;