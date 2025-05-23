'use client';

import Image from "next/image";
import {useState} from "react";

interface MemecoinImageProps {
    logoUrl: string | null;
    symbol: string;
    size?: 'small' | 'medium' | 'large';
}

export default function MemecoinImage({logoUrl, symbol, size = 'medium'}: MemecoinImageProps) {
    const [hasError, setHasError] = useState(false);

    const dimensions = {
        small: {width: 96, height: 96, textSize: 'text-2xl'},
        medium: {width: 120, height: 120, textSize: 'text-3xl'},
        large: {width: 150, height: 150, textSize: 'text-4xl'}
    };

    const {width, height, textSize} = dimensions[size];

    if (!logoUrl || hasError) {
        return (
            <div
                className={`w-${width / 4} h-${height / 4} rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold ${textSize} shadow-md`}
                style={{width: width, height: height}}
            >
                {symbol.substring(0, 2)}
            </div>
        );
    }

    return (
        <Image
            src={logoUrl}
            alt={`${symbol} logo`}
            width={width}
            height={height}
            className="rounded-full shadow-md"
            onError={() => setHasError(true)}
            unoptimized
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiM4QjVDRjYiLz48L3N2Zz4="
        />
    );
}