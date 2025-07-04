export default defineAppConfig({
  appName: 'Guestlane',
  baseUrl: 'https://localhost:3000',
  logoUrl: 'https://guestlane.com/guestlane.svg',
  appDescription:
    'Effortlessly create and share personalized property guides with guests via QR code or email.',
  ui: {
    icons: {
      loading: 'i-lucide-loader-circle'
    },
    button: {
      slots: {
        base: 'cursor-pointer'
      }
    },
    colors: {
      primary: 'indigo',
      neutral: 'neutral'
    },
    dropdownMenu: {
      slots: {
        content: 'rounded-xl',
        itemLeadingIcon: 'size-4',
        itemTrailingIcon: 'size-4'
      }
    }
  },
  seo: {
    title: 'Guestlane',
    description:
      'Effortlessly create and share personalized property guides with guests via QR code or email.'
  }
});
