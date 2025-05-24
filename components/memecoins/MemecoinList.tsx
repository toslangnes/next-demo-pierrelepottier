import {getMemecoins} from "@/lib/actions/memecoin.actions";
import MemecoinItem from "@/components/memecoins/MemecoinItem.client";

export async function MemecoinList({ searchQuery }: { searchQuery?: string }) {
    const coins = await getMemecoins(searchQuery);

    return (
        <div className="flex flex-col gap-3">
            {coins.length > 0 ? (
                coins.map((coin) => (
                    <MemecoinItem coin={coin} key={coin.id}/>
                ))
            ) : (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun memecoin trouvé</p>
                </div>
            )}
        </div>
    );
}
