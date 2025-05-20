import {getMemecoins} from "@/lib/memecoin.actions";
import MemecoinItem from "@/components/memecoins/MemecoinItem.client";

export async function MemecoinList() {
    const coins = await getMemecoins();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coins.map((coin) => (
                <MemecoinItem coin={coin} key={coin.id}/>
            ))}
        </div>
    );
}
