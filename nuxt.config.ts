import path from 'node:path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    experimental: {
        appManifest: false
    },
    router: {
        options: {
            hashMode: true
        }
    },
    srcDir: 'src',
    css: ['~/assets/css/main.css'],
    modules: ['nuxt-electron', 'floating-vue/nuxt', '@nuxt/image'],
    electron: {
        disableDefaultOptions: true,
        build: [
            {
                entry: 'src/electron/main.ts',
                vite: {
                    resolve: {
                        alias: {
                            '~': path.resolve(__dirname, 'src'),
                        }
                    },
                    build: {
                        minify: process.env.NODE_ENV === 'production',
                        commonjsOptions: {
                            dynamicRequireTargets: ["@libsql/win32-x64-msvc"]
                        },
                        rollupOptions: {
                            external: ["@libsql/client", "@libsql/win32-x64-msvc"],
                        }
                    }
                },
                onstart(args) {
                    // Pass the --open-devtools flag to Electron
                    args.startup([".", "--open-dev-tools=true"]);
                    args.reload();
                },
            },
            {
                entry: 'src/electron/preload.ts',
                onstart(args) {
                    args.reload()
                },
                vite: {
                    build: {
                        minify: process.env.NODE_ENV === 'production',
                    }
                },
            },
        ],
        renderer: {}
    },
    app: {
        head: {
            meta: [
                { "http-equiv": "Content-Security-Policy", content: "script-src 'self' 'unsafe-inline'" },
            ]
        },
        baseURL: './',
        buildAssetsDir: process.env.NODE_ENV === 'production' ? '/' : '/_nuxt'
    },
    runtimeConfig: {
        app: {
            baseURL: './',
            buildAssetsDir: process.env.NODE_ENV === 'production' ? '/' : '/_nuxt'
        }
    },
    vite: {
        resolve: {
            alias: {
                '~': path.resolve(__dirname, 'src'),
            }
        }
    },
    ssr: false,
    spaLoadingTemplate: true
});