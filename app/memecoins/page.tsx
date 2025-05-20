import {MemecoinList} from "@/components/memecoins/MemecoinList";
import {CreateMemecoinButton} from "@/components/memecoins/CreateMemecoinButton";
import {Suspense} from "react";

export const dynamic = "force-dynamic";

export default async function MemecoinsPage() {

    return (
        <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Explore Coins</h1>
                <CreateMemecoinButton/>
            </div>

            <Suspense fallback={<p>Chargement du formulaire…</p>}>
                <MemecoinList/>
            </Suspense>

        </section>
    );
}
