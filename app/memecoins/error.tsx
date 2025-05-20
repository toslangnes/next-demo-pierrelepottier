'use client';
export default function Error({error}: { error: Error & { digest?: string } }) {
    return <p className="text-destructive">Une erreur est survenue : {error.message}</p>;
}