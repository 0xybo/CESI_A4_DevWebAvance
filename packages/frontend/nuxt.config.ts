import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    ssr: false,
    devtools: {
        enabled: process.env.NODE_ENV === 'development',
        host: '0.0.0.0',
        timeline: {
            enabled: true,
        },
    },
    modules: ['shadcn-nuxt', '@pinia/nuxt'],
    css: ['~/assets/css/main.css'],
    devServer: {
        port: Number(process.env.FRONTEND_PORT) || 5173,
        host: process.env.FRONTEND_HOST || 'localhost',
    },
    nitro: {
        output: {
            dir: 'dist',
        },
        prerender: {
            crawlLinks: false,
            routes: ['/'],
        },
    },
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            include: ['@vueuse/core', 'class-variance-authority', 'clsx', 'reka-ui', '@lucide/vue', 'tailwind-merge'],
        },
    },
    app: {
        head: {
            link: [{ rel: 'icon', type: 'image/svg+xml', href: '/icon-color.svg' }],
        },
    },
});
