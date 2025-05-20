import {getMemecoin} from "@/lib/memecoin.actions";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import Image from "next/image";
import PriceChart from "@/components/memecoins/PriceChart.client";
import DeleteMemecoinButton from "@/components/memecoins/DeleteMemecoinButton.client";

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

    let coin;
    try {
        coin = await getMemecoin(id);
    } catch {
        return notFound();
    }

    return (
        <article className="prose max-w-none">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {coin.logoUrl && (
                        <Image
                            src={coin.logoUrl}
                            alt="logo"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    )}
                    <h1 className="mb-0">{coin.name}</h1>
                    <span className="text-lg">({coin.symbol})</span>
                </div>
                <DeleteMemecoinButton memecoinId={coin.id}/>
            </header>
            {coin.description && <p>{coin.description}</p>}
            <p>
                Prix actuel : <strong>{coin.price.toFixed(4)} ZTH</strong>
            </p>
            <p>
                Supply : <strong>{coin.supply.toLocaleString()} tokens</strong>
            </p>
            <PriceChart memecoinId={coin.id}/>
        </article>
    );
}