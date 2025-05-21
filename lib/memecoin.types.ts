import {z} from "zod";

const num = z.coerce.number();

export const memecoinSchema = z.object({
    id: z.string(),
    name: z.string(),
    symbol: z.string(),
    description: z.string().nullable().optional(),
    logoUrl: z.string().url().nullable().optional(),
    supply: num.optional().default(0),
    price: num.optional().default(0),
    reserve: num.optional().default(0),
});
export type Memecoin = z.infer<typeof memecoinSchema>;

export const createMemecoinSchema = z.object({
    name: z.string().min(4).max(16),
    symbol: z.string().min(2).max(4).regex(/^[A-Z]+$/),
    description: z.string().max(1000).optional(),
    logoUrl: z.string().url().max(200).optional(),
});
