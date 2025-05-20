import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FetchOptions = RequestInit & {
    next?: {
        revalidate?: number;
    };
};

export async function fetchWithRetries(
    url: string,
    options?: FetchOptions,
    retries = 3,
    retryDelay = 500
): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, options);

            if (response.status >= 500 && attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                continue;
            }

            return response;
        } catch (error) {
            lastError = error as Error;

            if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }

    throw lastError || new Error(`Failed to fetch ${url} after ${retries} retries`);
}
