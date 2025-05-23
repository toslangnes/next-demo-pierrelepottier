import {getMemecoins} from "@/lib/memecoin.actions";
import MemecoinItem from "@/components/memecoins/MemecoinItem.client";

export async function MemecoinList() {
    const coins = await getMemecoins();

    return (
        <div className="flex flex-col gap-3">
            {coins.map((coin) => (
                <MemecoinItem coin={coin} key={coin.id}/>
            ))}
        </div>
    );
}
