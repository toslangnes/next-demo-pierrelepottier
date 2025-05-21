'use client';
import {createMemecoinSchema} from "@/lib/memecoin.types";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {toast} from 'sonner';
import {useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {createMemecoin} from "@/lib/memecoin.actions";
import {z} from 'zod';

export function CreateMemecoinForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<z.infer<typeof createMemecoinSchema>>({
        resolver: zodResolver(createMemecoinSchema),
    });

    async function onSubmit(data: z.infer<typeof createMemecoinSchema>) {
        startTransition(async () => {
            try {
                const form = new FormData();
                Object.entries(data).forEach(([k, v]) => v && form.append(k, v));
                const result = await createMemecoin(null, form);

                if (result.success) {
                    toast.success('Memecoin créé!');
                    reset();
                    router.push('/memecoins');
                } else {
                    toast.error(result.message || 'Une erreur est survenue lors de la création du memecoin');
                }
            } catch (err) {
                toast.error((err as Error).message);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
            {(['name', 'symbol', 'description', 'logoUrl'] as const).map((field) => (
                <div key={field} className="flex flex-col gap-1 col-span-full sm:col-span-1">
                    <Label htmlFor={field}>{field}</Label>
                    <Input id={field} {...register(field)} aria-invalid={!!errors[field]}/>
                    {errors[field] && <p className="text-xs text-destructive">{errors[field]?.message as string}</p>}
                </div>
            ))}
            <div className="col-span-full h-4"></div>
            <div className="col-span-full mb-4 p-3 bg-muted rounded-md flex items-center gap-2 text-sm">
                <span className="font-medium">Fee:</span> Creating a memecoin costs 1 ZTH
            </div>
            <Button type="submit" disabled={isPending} className="col-span-full w-fit">Créer</Button>
        </form>
    );
}
