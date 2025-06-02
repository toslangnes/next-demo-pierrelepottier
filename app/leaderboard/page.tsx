import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Trophy, Coins} from "lucide-react";
import {getLeaderboardUsers} from "@/lib/actions/user.actions";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
    const users = await getLeaderboardUsers();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-500"/>
                    Leaderboard
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Top Traders</CardTitle>
                    <CardDescription>Users ranked by ZTH balance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {users.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Rank</th>
                                        <th className="text-left py-3 px-4">User</th>
                                        <th className="text-left py-3 px-4">ZTH Balance</th>
                                        <th className="text-left py-3 px-4">Memecoins Created</th>
                                        <th className="text-left py-3 px-4">Transactions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/50">
                                            <td className="py-3 px-4">
                                                {index === 0 ? (
                                                    <span className="text-yellow-500 font-bold">🥇 1</span>
                                                ) : index === 1 ? (
                                                    <span className="text-gray-400 font-bold">🥈 2</span>
                                                ) : index === 2 ? (
                                                    <span className="text-amber-700 font-bold">🥉 3</span>
                                                ) : (
                                                    <span>{index + 1}</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 font-medium">{user.name || "Anonymous"}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1">
                                                    <Coins className="h-4 w-4 text-purple-500"/>
                                                    <span className="font-bold">{user.zthBalance.toFixed(2)} ZTH</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">{user.memecoins.length}</td>
                                            <td className="py-3 px-4">{user.transactions.length}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p>No users found.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
