import path from "path";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig({
    // GitHub Pages 部署路径配置
    // 仓库名是 ying，所以设置 base 为 '/ying/'
    // 如果使用自定义域名，则改为 '/'
    base: '/ying/',

    plugins: [
        react(),
        legacy(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
            manifest: {
                name: "MyTools - 轻量工具集",
                short_name: "MyTools",
                description: "一站式图片处理工具集，支持离线使用",
                theme_color: "#020617",
                icons: [
                    {
                        src: "/dragon1.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/dragon1.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "gstatic-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
        }),
        process.env.ANALYZE === "true" ? visualizer({ open: true }) : null,
    ].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-core': ['react', 'react-dom'],
                    'react-router': ['react-router-dom'],
                    'antd': ['antd'],
                    'html2canvas': ['html2canvas'],
                }
            },
        },
        minify: "esbuild",
        terserOptions: {
            compress: {
                drop_console: true,
                pure_funcs: ["console.log"],
            },
        },
    },
    optimizeDeps: {
        entries: ["./src/main.tsx"],
        exclude: ["some-heavy-lib"],
    },
});
