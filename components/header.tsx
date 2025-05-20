import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/app/auth";
import { LogIn, LogOut, Coins } from "lucide-react";

const links = [
    {href: "/memecoins", label: "Memecoins"},
];

export default async function Header() {
    // Get the session from the auth function
    const session = await auth();
    const isLoggedIn = !!session?.user;

    return (
        <header className="bg-white border-b">
            <div className="flex items-center justify-between py-2 px-4">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent flex items-center">
                    <Coins className="h-5 w-5 mr-2" />
                    Memecoin Explorer
                </Link>

                <div className="flex items-center gap-4">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {links.map((link) => (
                                <NavigationMenuItem key={link.href}>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link href={link.href} passHref>
                                            {link.label}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                            <NavigationMenuItem>
                                {isLoggedIn ? (
                                    <form action={async () => {
                                        "use server";
                                        await signOut({
                                            redirectTo: "/"
                                        });
                                    }}>
                                        <Button type="submit" variant="outline" className="flex items-center gap-1 h-10">
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </Button>
                                    </form>
                                ) : (
                                    <Button variant="outline" asChild className="h-10">
                                        <Link href="/login" className="flex items-center gap-1">
                                            <LogIn className="h-4 w-4" />
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
