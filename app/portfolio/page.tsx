import {auth} from "@/app/auth";
import {redirect} from "next/navigation";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent} from "@/components/ui/card";
import MemecoinItem from "@/components/memecoins/MemecoinItem.client";
import {Wallet, PlusCircle, User} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {getUserCreatedMemecoins, getUserPurchasedMemecoins} from "@/lib/actions/memecoin.actions";
import {getUserProfile} from "@/lib/actions/user.actions";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const userId = session.user.id;

    const createdMemecoins = await getUserCreatedMemecoins(userId);

    const createdMemecoinIds = createdMemecoins.map(coin => coin.id);

    const purchasedMemecoins = await getUserPurchasedMemecoins(userId, createdMemecoinIds);

    const user = await getUserProfile(userId);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
                    <User className="h-6 w-6 text-indigo-500"/>
                    My Portfolio
                </h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-muted">
                        <Wallet className="h-4 w-4"/>
                        <span>{user?.zthBalance.toFixed(2)} ZTH</span>
                    </div>
                    <Button asChild size="sm" className="flex items-center gap-2">
                        <Link href="/memecoins/create">
                            <PlusCircle className="h-4 w-4"/>
                            Create Coin
                        </Link>
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="created" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="created">Created ({createdMemecoins.length})</TabsTrigger>
                    <TabsTrigger value="purchased">Purchased ({purchasedMemecoins.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="created" className="space-y-4">
                    {createdMemecoins.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {createdMemecoins.map((coin) => (
                                <MemecoinItem coin={coin} key={coin.id}/>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <p className="mb-4">You haven&apos;t created any memecoins yet.</p>
                                <Button asChild>
                                    <Link href="/memecoins/create">Create Your First Memecoin</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="purchased" className="space-y-4">
                    {purchasedMemecoins.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {purchasedMemecoins.map((coin) => (
                                <MemecoinItem coin={coin} key={coin.id}/>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <p className="mb-4">You haven&apos;t purchased any memecoins yet.</p>
                                <Button asChild>
                                    <Link href="/memecoins">Explore Memecoins</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
