import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {auth, signOut} from "@/app/auth";
import {LogIn, LogOut, Coins, Wallet, User, Trophy, Settings} from "lucide-react";
import {prisma} from "@/lib/prisma";

const links = [
    {href: "/memecoins", label: "Memecoins", icon: Coins},
    {href: "/leaderboard", label: "Leaderboard", icon: Trophy},
];

export default async function Header() {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    let zthBalance = 0;
    if (isLoggedIn && session?.user?.id) {
        const user = await prisma.user.findUnique({
            where: {id: session.user.id},
            select: {zthBalance: true}
        });
        if (user) {
            zthBalance = user.zthBalance;
        }
    }

    return (
        <header className="bg-white border-b">
            <div className="flex items-center justify-between py-2 px-4">
                <Link href="/"
                      className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent flex items-center">
                    <Coins className="h-5 w-5 mr-2"/>
                    MEMECOIN EXPLORER
                </Link>

                <div className="flex items-center gap-4">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {links.map((link) => (
                                <NavigationMenuItem key={link.href}>
                                    <NavigationMenuLink
                                        asChild
                                        className={`${navigationMenuTriggerStyle()} h-10 flex items-center justify-center`}
                                    >
                                        <Link href={link.href} passHref className="flex items-center justify-center gap-1 h-full">
                                            {link.icon && <link.icon className="h-4 w-4" />}
                                            {link.label}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                            {isLoggedIn && (
                                <>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink
                                            asChild
                                            className={`${navigationMenuTriggerStyle()} h-10 flex items-center justify-center`}
                                        >
                                            <Link href="/portfolio" passHref className="flex items-center justify-center gap-1 h-full">
                                                <User className="h-4 w-4"/>
                                                Portfolio
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink
                                            asChild
                                            className={`${navigationMenuTriggerStyle()} h-10 flex items-center justify-center`}
                                        >
                                            <Link href="/profile" passHref className="flex items-center justify-center gap-1 h-full">
                                                <Settings className="h-4 w-4"/>
                                                Profile
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <div
                                            className="flex items-center justify-center gap-2 px-3 py-2 h-10 text-sm font-medium rounded-md bg-muted">
                                            <Wallet className="h-4 w-4"/>
                                            <span>{zthBalance.toFixed(2)} ZTH</span>
                                        </div>
                                    </NavigationMenuItem>
                                </>
                            )}
                            <NavigationMenuItem>
                                {isLoggedIn ? (
                                    <form action={async () => {
                                        "use server";
                                        await signOut({
                                            redirectTo: "/"
                                        });
                                    }}>
                                        <Button type="submit" variant="outline" className="flex items-center justify-center gap-1 h-10">
                                            <LogOut className="h-4 w-4"/>
                                            Logout
                                        </Button>
                                    </form>
                                ) : (
                                    <Button variant="outline" asChild className="h-10">
                                        <Link href="/login" className="flex items-center justify-center gap-1">
                                            <LogIn className="h-4 w-4"/>
                                            Login
                                        </Link>
                                    </Button>
                                )}
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </header>
    );
}
