import path from 'node:path';

const viteResolveAlias = {
    '~': path.resolve(__dirname, 'app'),
    '#types': path.resolve(__dirname, 'shared/types'),
    '#electron': path.resolve(__dirname, 'electron'),
    '#utils': path.resolve(__dirname, 'shared/utils')
};

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
    imports: {
        dirs: [
            "shared/types/**/*.ts",
            "shared/types/*.ts"
        ]
    },
    css: ['~/assets/css/main.css'],
    modules: ['nuxt-electron', 'floating-vue/nuxt', '@nuxt/image'],
    electron: {
        disableDefaultOptions: process.env.NODE_ENV !== 'production',
        build: [
            {
                entry: 'electron/main.ts',
                vite: {
                    resolve: {
                        alias: viteResolveAlias
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
                entry: 'electron/preload.ts',
                onstart(args) {
                    args.reload()
                },
                vite: {
                    build: {
                        minify: process.env.NODE_ENV === 'production',
                    }
                },
            },
            {
                entry: 'electron/workers/scanner.worker.ts',
                onstart(args) {
                    args.reload()
                },
                vite: {
                    build: {
                        minify: process.env.NODE_ENV === 'production',
                    },
                    resolve: {
                        alias: viteResolveAlias
                    }
                }
            }
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
                '~': path.resolve(__dirname, 'app'),
                '#types': path.resolve(__dirname, 'shared/types'),
                '#electron': path.resolve(__dirname, 'electron')
            }
        }
    },
    ssr: false,
    spaLoadingTemplate: true,

    // since nuxt 4
    typescript: {
        tsConfig: {
            include: [
                "../app/**/*",
                "../electron/**/*",
                "../shared/**/*"
            ],
            compilerOptions: {
                baseUrl: ".",
                paths: {
                    "#types/*": ["../shared/types/*"],
                    "#electron/*": ["../electron/*"],
                    "#utils/*": ["../shared/utils/*"]
                }
            }
        },
    }
});