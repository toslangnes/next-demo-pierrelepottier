import {MetadataRoute} from 'next';
import {getMemecoins} from '@/lib/memecoin.actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://memecoin-explorer.vercel.app';
    const currentDate = new Date();

    const routes = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/memecoins`,
            lastModified: currentDate,
            changeFrequency: 'hourly',
            priority: 0.9,
        },
    ] as MetadataRoute.Sitemap;

    try {
        const memecoins = await getMemecoins();

        if (!memecoins || memecoins.length === 0) {
            console.warn('No memecoins found for sitemap generation');
            return routes;
        }

        const memecoinRoutes = memecoins.map((coin) => ({
            url: `${baseUrl}/memecoins/${coin.id}`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.8,
        })) as MetadataRoute.Sitemap;

        return [...routes, ...memecoinRoutes];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return routes;
    }
}
