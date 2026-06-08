/** @type {import('next').NextConfig} */
const strapiBackend =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'development'
        ? 'http://localhost:1337'
        : 'https://dashboard.plantozone.com');

const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/strapi-api/:path*',
                destination: `${strapiBackend}/:path*`,
            },
        ];
    },
    images: {
        domains: [
            'source.unsplash.com',
            'images.unsplash.com',
            'plus.unsplash.com',
            'res.cloudinary.com',
            'localhost',
            'dashboard.plantozone.com',
            'plantozone-web-production.up.railway.app',
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'dashboard.plantozone.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'plantozone-web-production.up.railway.app',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
