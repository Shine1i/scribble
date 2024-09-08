import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      typography: ({ theme }) => ({
        gruvbox: {
          css: {
            '--tw-prose-body': '#3c3836', // fg
            '--tw-prose-headings': '#9d0006', // fg0
            '--tw-prose-lead': '#504945', // fg2
            '--tw-prose-links': '#076678', // blue
            '--tw-prose-bold': '#282828', // fg0
            '--tw-prose-counters': '#7c6f64', // fg4
            '--tw-prose-bullets': '#928374', // gray
            '--tw-prose-hr': '#d5c4a1', // bg2
            '--tw-prose-quotes': '#504945', // fg2
            '--tw-prose-quote-borders': '#bdae93', // bg3
            '--tw-prose-captions': '#665c54', // fg3
            '--tw-prose-code': '#9d0006', // red
            '--tw-prose-pre-code': '#3c3836', // bg0_h
            '--tw-prose-pre-bg': '#f2e5bc', // fg
            '--tw-prose-th-borders': '#d5c4a1', // bg2
            '--tw-prose-td-borders': '#ebdbb2', // bg1
            '--tw-prose-invert-body': '#ebdbb2', // bg1
            '--tw-prose-invert-headings': '#fbf1c7', // bg0_h
            '--tw-prose-invert-lead': '#d5c4a1', // bg2
            '--tw-prose-invert-links': '#83a598', // blue
            '--tw-prose-invert-bold': '#fbf1c7', // bg0_h
            '--tw-prose-invert-counters': '#bdae93', // bg3
            '--tw-prose-invert-bullets': '#928374', // gray
            '--tw-prose-invert-hr': '#504945', // fg2
            '--tw-prose-invert-quotes': '#d5c4a1', // bg2
            '--tw-prose-invert-quote-borders': '#665c54', // fg3
            '--tw-prose-invert-captions': '#bdae93', // bg3
            '--tw-prose-invert-code': '#fb4934', // bright red
            '--tw-prose-invert-pre-code': '#282828', // fg0
            '--tw-prose-invert-pre-bg': '#ebdbb2', // bg1
            '--tw-prose-invert-th-borders': '#504945', // fg2
            '--tw-prose-invert-td-borders': '#3c3836', // fg
          },
        },
      }),
      
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}satisfies Config;
export default config;
