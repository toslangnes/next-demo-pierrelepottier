'use client';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {PlusCircle} from 'lucide-react';

export function CreateMemecoinButton() {
    return (
        <Button asChild size="sm" className="flex items-center gap-2">
            <Link href="/memecoins/create">
                <PlusCircle className="h-4 w-4"/>
                Create Coin
            </Link>
        </Button>
    );
}
