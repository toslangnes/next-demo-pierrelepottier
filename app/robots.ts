import {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/_next/', '/login'],
        },
        sitemap: 'https://memecoin-explorer.vercel.app/sitemap.xml',
    };
}
