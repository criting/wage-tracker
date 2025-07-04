// https://nuxt.com/docs/api/configuration/nuxt-config
import { countryLocales } from './app/utils/locales'


export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-lottie'],
  css: ['~/assets/css/main.css'],
  future: {
    compatibilityVersion: 4
  },
  ssr: false
})