import type { Config } from 'tailwindcss'

const c = (v: string) => `hsl(var(--${v}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        brand: ['"Montserrat"', 'sans-serif'],
      },
      colors: {
        border: c('border'),
        background: c('background'),
        foreground: c('foreground'),
        card: c('card'),
        primary: { DEFAULT: c('primary'), foreground: c('primary-foreground') },
        muted: { DEFAULT: c('muted'), foreground: c('muted-foreground') },
        accent: { DEFAULT: c('accent'), foreground: c('accent-foreground') },
        positive: c('positive'),
        negative: c('negative'),
        info: c('info'),
        topbar: c('topbar'),
      },
    },
  },
} satisfies Config
