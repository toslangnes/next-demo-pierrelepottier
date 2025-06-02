import {getMemecoin} from "@/lib/actions/memecoin.actions";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import MemecoinTrading from "@/components/memecoins/MemecoinTrading.client";
import MemecoinImage from "@/components/memecoins/MemecoinImage.client";
import {auth} from "@/app/auth";
import {Separator} from "@/components/ui/separator";
import {getUserProfile} from "@/lib/actions/user.actions";
import {getUserTransactions} from "@/lib/actions/trading.actions";

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

    let userBalance = 0;
    let userHoldings = 0;

    if (session?.user?.id) {
        const user = await getUserProfile(session.user.id);
        if (user) {
            userBalance = user.zthBalance;
        }

        const userTransactions = await getUserTransactions(session.user.id, id);

        for (const tx of userTransactions) {
            if (tx.type === "BUY" && tx.quantity) {
                userHoldings += tx.quantity;
            } else if (tx.type === "SELL" && tx.quantity) {
                userHoldings -= tx.quantity;
            }
        }
    }

    return (
        <div className="space-y-8">
            <article className="prose max-w-none">
                <header className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <MemecoinImage
                            logoUrl={coin.logoUrl ?? null}
                            symbol={coin.symbol}
                            size="medium"
                        />
                        <div>
                            <h1 className="mb-0 text-3xl">{coin.name}</h1>
                            <span className="text-lg bg-muted px-2 py-0.5 rounded-md">({coin.symbol})</span>
                        </div>
                    </div>
                </header>
                {coin.description && <p>{coin.description}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <h3 className="text-lg font-medium">Trading Info</h3>
                        <p>
                            Current Price: <strong>{coin.price.toFixed(4)} ZTH</strong>
                        </p>
                        <p>
                            Supply: <strong>{coin.supply.toLocaleString()} tokens</strong>
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">Bonding Curve Parameters</h3>
                        <p>
                            Base Price: <strong>{coin.startingPrice.toFixed(4)} ZTH</strong>
                        </p>
                        <p>
                            Growth Factor: <strong>{(coin.growthRate * 100).toFixed(2)}%</strong> per token
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Formula: P = {coin.startingPrice.toFixed(4)} × e<sup>{coin.growthRate.toFixed(4)} × S</sup>
                        </p>
                    </div>
                </div>
            </article>

            <Separator/>

            <MemecoinTrading
                memecoin={coin}
                userBalance={userBalance}
                userHoldings={userHoldings}
                isLoggedIn={!!session?.user}
            />
        </div>
    );
}
