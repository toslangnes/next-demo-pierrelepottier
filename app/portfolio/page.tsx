import {auth} from "@/app/auth";
import {redirect} from "next/navigation";
import {prisma} from "@/lib/prisma";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent} from "@/components/ui/card";
import MemecoinItem from "@/components/memecoins/MemecoinItem.client";
import {Wallet, PlusCircle, User} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const createdMemecoins = await prisma.memecoin.findMany({
        where: {userId: session.user.id},
        orderBy: {createdAt: "desc"}
    });

    const transactions = await prisma.transaction.findMany({
        where: {
            userId: session.user.id,
            type: "BUY",
            NOT: {memecoinId: null}
        },
        include: {memecoin: true}
    });

    const purchasedMemecoinIds = new Set();
    transactions.forEach(tx => {
        if (tx.memecoinId && !createdMemecoins.some(coin => coin.id === tx.memecoinId)) {
            purchasedMemecoinIds.add(tx.memecoinId);
        }
    });

    const purchasedMemecoins = await prisma.memecoin.findMany({
        where: {
            id: {in: Array.from(purchasedMemecoinIds) as string[]}
        },
        orderBy: {updatedAt: "desc"}
    });

    const user = await prisma.user.findUnique({
        where: {id: session.user.id},
        select: {zthBalance: true}
    });

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
