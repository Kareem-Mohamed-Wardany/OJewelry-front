/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'res.cloudinary.com',
                port: '', // If no specific port, leave it as an empty string
                pathname: '/**', // Allows any path within the domain
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '', // If no specific port, leave it as an empty string
                pathname: '/**', // Allows any path within the domain
            },
        ],
    },
    reactStrictMode: false,
};

export default nextConfig;
