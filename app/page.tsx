import Link from 'next/link';
import Image from 'next/image';
import {Button} from '@/components/ui/button';
import {getMemecoins} from '@/lib/memecoin.actions';

export default async function Home() {
    const memecoins = await getMemecoins().then(coins => coins.slice(0, 3));

    return (
        <div className="flex flex-col gap-8">
            <section className="py-16 text-center max-w-3xl mx-auto">
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Bienvenue sur Memecoin Explorer</h1>
                <p className="text-xl text-muted-foreground mb-10 px-4">
                    Découvrez, suivez et créez des memecoins sur notre plateforme
                </p>
                <div className="flex justify-center gap-4">
                    <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                        <Link href="/memecoins">Explorer les Memecoins</Link>
                    </Button>
                </div>
            </section>

            <section className="py-8">
                <h2 className="text-2xl font-bold mb-6">Memecoins populaires</h2>
                <div className="grid sm:grid-cols-3 gap-6">
                    {memecoins.map(coin => (
                        <Link
                            href={`/memecoins/${coin.id}`}
                            key={coin.id}
                            className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {coin.logoUrl &&
                                    <Image src={coin.logoUrl} alt="" width={32} height={32} className="rounded-full"/>}
                                <h3 className="font-medium">{coin.name}</h3>
                                <span className="text-xs bg-muted px-2 rounded">{coin.symbol}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {coin.description || "Pas de description disponible"}
                            </p>
                            <p className="text-sm font-semibold">💰 {coin.price.toFixed(4)} ZTH</p>
                        </Link>
                    ))}
                </div>
                <div className="mt-6 text-center">
                    <Button variant="outline" asChild>
                        <Link href="/memecoins">Voir tous les memecoins</Link>
                    </Button>
                </div>
            </section>

            <section className="py-8 bg-muted/30 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Qu&apos;est-ce qu&apos;un Memecoin?</h2>
                <p className="mb-4">
                    Les memecoins sont des cryptomonnaies inspirées par des mèmes internet, des blagues ou des
                    phénomènes culturels.
                    Contrairement aux cryptomonnaies traditionnelles, elles sont souvent créées pour le divertissement
                    plutôt que pour une utilité spécifique.
                </p>
                <p>
                    Sur Memecoin Explorer, vous pouvez suivre les dernières tendances, créer vos propres memecoins et
                    participer à cette communauté dynamique.
                </p>
            </section>
        </div>
    );
}
