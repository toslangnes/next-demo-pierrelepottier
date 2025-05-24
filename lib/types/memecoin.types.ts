import {z} from "zod";

const num = z.coerce.number();

export const memecoinSchema = z.object({
    id: z.string(),
    name: z.string(),
    symbol: z.string(),
    description: z.string().nullable().optional(),
    logoUrl: z.string().url().nullable().optional(),
    supply: num,
    price: num,
    reserve: num,
    startingPrice: num.default(0.1),
    growthRate: num.default(0.005),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    userId: z.string().nullable().optional(),
    owner: z.string().nullable().optional(),
});

export type Memecoin = z.infer<typeof memecoinSchema>;

export const createMemecoinSchema = z.object({
    name: z.string().min(4).max(16),
    symbol: z.string().min(2).max(4).regex(/^[A-Z]+$/),
    description: z.string().max(1000).optional(),
    logoUrl: z.string().url().max(200).optional(),
    startingPrice: num.min(0.01).max(10).default(0.1),
    growthRate: num.min(0.0001).max(0.01).default(0.005),
});

