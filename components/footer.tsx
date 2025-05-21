import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-auto py-3 border-t">
            <div
                className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <div className="mb-2 sm:mb-0">
                    <p>© {new Date().getFullYear()} Memecoin Explorer. All rights reserved.</p>
                </div>
                <div className="flex gap-6">
                    <Link href="#" className="hover:text-foreground transition-colors">
                        Terms
                    </Link>
                    <Link href="#" className="hover:text-foreground transition-colors">
                        Privacy
                    </Link>
                    <Link href="#" className="hover:text-foreground transition-colors">
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
}
