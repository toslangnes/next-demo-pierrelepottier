import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MemecoinItem from "@/components/memecoins/MemecoinItem.client";
import { Wallet, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  // Check if the user is authenticated
  const session = await auth();

  // If not authenticated, redirect to login
  if (!session?.user) {
    redirect("/login");
  }

  // Get user's created memecoins
  const createdMemecoins = await prisma.memecoin.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  // Get user's transactions to find purchased memecoins
  const transactions = await prisma.transaction.findMany({
    where: { 
      userId: session.user.id,
      type: "BUY",
      NOT: { memecoinId: null }
    },
    include: { memecoin: true }
  });

  // Get unique purchased memecoins (excluding ones created by the user)
  const purchasedMemecoinIds = new Set();
  transactions.forEach(tx => {
    if (tx.memecoinId && !createdMemecoins.some(coin => coin.id === tx.memecoinId)) {
      purchasedMemecoinIds.add(tx.memecoinId);
    }
  });

  // Fetch full details of purchased memecoins
  const purchasedMemecoins = await prisma.memecoin.findMany({
    where: { 
      id: { in: Array.from(purchasedMemecoinIds) as string[] }
    },
    orderBy: { updatedAt: "desc" }
  });

  // Get user's ZTH balance
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { zthBalance: true }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">My Portfolio</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-muted">
            <Wallet className="h-4 w-4" />
            <span>{user?.zthBalance.toFixed(2)} ZTH</span>
          </div>
          <Button asChild size="sm" className="flex items-center gap-2">
            <Link href="/memecoins/create">
              <PlusCircle className="h-4 w-4" />
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
                <MemecoinItem coin={coin} key={coin.id} />
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
                <MemecoinItem coin={coin} key={coin.id} />
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
