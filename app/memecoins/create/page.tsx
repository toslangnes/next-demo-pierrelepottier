import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateMemecoinForm } from "@/components/memecoins/CreateMemecoinForm";

// This is a server component that checks authentication
export default async function CreateMemecoinPage() {
  // Check if the user is authenticated
  const session = await auth();

  // If not authenticated, redirect to login
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Memecoin</h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>New Memecoin</CardTitle>
          <CardDescription>
            Fill out the form below to create a new memecoin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateMemecoinForm />
        </CardContent>
      </Card>
    </div>
  );
}
