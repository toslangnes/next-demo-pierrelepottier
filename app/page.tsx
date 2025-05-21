import {getMemecoins} from '@/lib/memecoin.actions';
import HomeContent from '@/components/HomeContent.client';
import {auth} from '@/app/auth';

export default async function Home() {
    const memecoins = await getMemecoins().then(coins => coins.slice(0, 3));
    const session = await auth();
    const isLoggedIn = !!session?.user;
    const userName = session?.user?.name || '';

    return <HomeContent memecoins={memecoins} isLoggedIn={isLoggedIn} userName={userName} />;
}
