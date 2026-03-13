// https://nitro.build/config
export default defineNitroConfig({
  srcDir: 'server',
  compatibilityDate: '2025-07-15',
  devServer: { port: 3001 },
  routeRules: {
    '/**': { cors: true }
  }
})
