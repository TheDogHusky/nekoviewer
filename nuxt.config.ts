// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    srcDir: 'src',
    css: ['~/assets/css/main.css'],
    modules: ['nuxt-electron'],
    electron: {
        disableDefaultOptions: true,
        build: [
            {
                entry: 'src/electron/main.ts',
            },
            {
                entry: 'src/electron/preload.ts',
                onstart(args) {
                    args.reload()
                },
            },
        ],
        renderer: {},
    },
    ssr: false,
})