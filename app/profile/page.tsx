import {auth} from "@/app/auth";
import {redirect} from "next/navigation";
import {prisma} from "@/lib/prisma";
import {ProfileForm} from "@/components/profile/ProfileForm";
import {Settings} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {id: session.user.id},
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
                    <Settings className="h-6 w-6 text-indigo-500"/>
                    Profile Settings
                </h1>
            </div>

            <div className="mt-8">
                <ProfileForm user={user}/>
            </div>
        </div>
    );
}