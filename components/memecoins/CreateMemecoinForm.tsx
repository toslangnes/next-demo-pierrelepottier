'use client';
import {createMemecoinSchema} from "@/lib/types/memecoin.types";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {toast} from 'sonner';
import {useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {createMemecoin} from "@/lib/actions/memecoin.actions";
import {z} from 'zod';
import {BondingCurveChart} from '@/components/memecoins/BondingCurveChart';

export function CreateMemecoinForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        watch,
    } = useForm<z.infer<typeof createMemecoinSchema>>({
        resolver: zodResolver(createMemecoinSchema),
        defaultValues: {
            startingPrice: 0.1,
            growthRate: 0.005,
        }
    });

    const watchStartingPrice = watch("startingPrice") || 0.1;
    const watchGrowthRate = watch("growthRate") || 0.005;

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

            <div className="col-span-full">
                <h3 className="text-lg font-medium mb-4">Bonding Curve Parameters</h3>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="startingPrice">Starting Price (ZTH)</Label>
                            <span className="text-sm font-medium">{watchStartingPrice.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            id="startingPrice"
                            min="0.01"
                            max="1"
                            step="0.01"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            {...register("startingPrice", {valueAsNumber: true})}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0.01</span>
                            <span>1.00</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="growthRate">Growth Rate</Label>
                            <span className="text-sm font-medium">{watchGrowthRate.toFixed(4)}</span>
                        </div>
                        <input
                            type="range"
                            id="growthRate"
                            min="0.0001"
                            max="0.01"
                            step="0.0001"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            {...register("growthRate", {valueAsNumber: true})}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Gentle</span>
                            <span>Aggressive</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <BondingCurveChart
                        currentSupply={0}
                        startingPrice={watchStartingPrice}
                        growthRate={watchGrowthRate}
                        previewMode={true}
                    />
                </div>
            </div>

            <div className="col-span-full h-4"></div>
            <div className="col-span-full mb-4 p-3 bg-muted rounded-md flex items-center gap-2 text-sm">
                <span className="font-medium">Fee:</span> Creating a memecoin costs 1 ZTH
            </div>
            <Button type="submit" disabled={isPending} className="col-span-full w-fit">Créer</Button>
        </form>
    );
}
