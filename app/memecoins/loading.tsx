import {Skeleton} from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length: 6}).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full"/>
            ))}
        </div>
    );
}