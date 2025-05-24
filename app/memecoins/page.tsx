import {MemecoinList} from "@/components/memecoins/MemecoinList";
import {CreateMemecoinButton} from "@/components/memecoins/CreateMemecoinButton";
import {Suspense} from "react";
import {Coins} from "lucide-react";
import MemecoinSearchBar from "@/components/memecoins/MemecoinSearchBar.client";

export const dynamic = "force-dynamic";

export default async function MemecoinsPage({
    searchParams
}: {
    searchParams: { q?: string }
}) {
    const params = await searchParams;
    const searchQuery = params.q || '';

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
                    <Coins className="h-6 w-6 text-indigo-500"/>
                    Explore Coins
                </h1>
                <div className="flex items-center gap-4">
                    <MemecoinSearchBar />
                    <CreateMemecoinButton/>
                </div>
            </div>

            <Suspense key={searchQuery} fallback={<p>Chargement des memecoins…</p>}>
                <MemecoinList searchQuery={searchQuery}/>
            </Suspense>

        </section>
    );
}
