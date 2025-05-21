import {getMemecoin} from "@/lib/memecoin.actions";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import DeleteMemecoinButton from "@/components/memecoins/DeleteMemecoinButton.client";
import {TradingInterface} from "@/components/memecoins/TradingInterface";
import {BondingCurveChart} from "@/components/memecoins/BondingCurveChart";
import MemecoinImage from "@/components/memecoins/MemecoinImage.client";
import {auth} from "@/app/auth";
import {prisma} from "@/lib/prisma";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {LogIn} from "lucide-react";

type PageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {id} = await params;

    try {
        const coin = await getMemecoin(id);
        return {
            title: `${coin.name} (${coin.symbol}) | Memecoins`,
            description: coin.description ?? undefined,
            openGraph: {
                images: [`/memecoins/${coin.id}/opengraph-image`],
            },
        };
    } catch {
        return {title: "Memecoin non trouvé"};
    }
}

export default async function MemecoinDetails({params}: PageProps) {
    const {id} = await params;
    const session = await auth();

    let coin;
    try {
        coin = await getMemecoin(id);
    } catch {
        return notFound();
    }

    // Get user's ZTH balance if logged in
    let userBalance = 0;
    if (session?.user?.id) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { zthBalance: true }
        });
        if (user) {
            userBalance = user.zthBalance;
        }
    }

    return (
        <div className="space-y-8">
            <article className="prose max-w-none">
                <header className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <MemecoinImage 
                            logoUrl={coin.logoUrl} 
                            symbol={coin.symbol} 
                            size="medium" 
                        />
                        <div>
                            <h1 className="mb-0 text-3xl">{coin.name}</h1>
                            <span className="text-lg bg-muted px-2 py-0.5 rounded-md">({coin.symbol})</span>
                        </div>
                    </div>
                    {session?.user?.id === coin.userId && (
                        <DeleteMemecoinButton memecoinId={coin.id}/>
                    )}
                </header>
                {coin.description && <p>{coin.description}</p>}
                <p>
                    Prix actuel : <strong>{coin.price.toFixed(4)} ZTH</strong>
                </p>
                <p>
                    Supply : <strong>{coin.supply.toLocaleString()} tokens</strong>
                </p>
            </article>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BondingCurveChart currentSupply={coin.supply} />
                {session?.user ? (
                    <TradingInterface memecoin={coin} userBalance={userBalance} />
                ) : (
                    <div className="text-center p-6 bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
                        <p className="text-lg">Login to buy or sell {coin.symbol} tokens</p>
                        <Button asChild className="flex items-center gap-2">
                            <Link href="/login">
                                <LogIn className="h-4 w-4" />
                                Login
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
