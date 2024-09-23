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
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        gruvbox: {
          css: {
            "--tw-prose-body": theme("colors.fg"),
            "--tw-prose-headings": theme("colors.heading"),
            "--tw-prose-lead": theme("colors.lead"),
            "--tw-prose-links": theme("colors.link"),
            "--tw-prose-bold": theme("colors.bold"),
            "--tw-prose-counters": theme("colors.counter"),
            "--tw-prose-bullets": theme("colors.bullet"),
            "--tw-prose-hr": theme("colors.hr"),
            "--tw-prose-quotes": theme("colors.quote"),
            "--tw-prose-quote-borders": theme("colors.quote-border"),
            "--tw-prose-captions": theme("colors.caption"),
            "--tw-prose-code": theme("colors.inline-code"),
            "--tw-prose-pre-code": theme("colors.pre-code"),
            "--tw-prose-pre-bg": theme("colors.pre-bg"),
            "--tw-prose-th-borders": theme("colors.th-border"),
            "--tw-prose-td-borders": theme("colors.td-border"),
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
        "gruvbox-fg": "hsl(var(--gruvbox-fg))",
        "gruvbox-heading": "hsl(var(--gruvbox-heading))",
        "gruvbox-lead": "hsl(var(--gruvbox-lead))",
        "gruvbox-link": "hsl(var(--gruvbox-link))",
        "gruvbox-bold": "hsl(var(--gruvbox-bold))",
        "gruvbox-counter": "hsl(var(--gruvbox-counter))",
        "gruvbox-bullet": "hsl(var(--gruvbox-bullet))",
        "gruvbox-hr": "hsl(var(--gruvbox-hr))",
        "gruvbox-quote": "hsl(var(--gruvbox-quote))",
        "gruvbox-quote-border": "hsl(var(--gruvbox-quote-border))",
        "gruvbox-caption": "hsl(var(--gruvbox-caption))",
        "gruvbox-inline-code": "hsl(var(--gruvbox-inline-code))",
        "gruvbox-pre-code": "hsl(var(--gruvbox-pre-code))",
        "gruvbox-pre-bg": "hsl(var(--gruvbox-pre-bg))",
        "gruvbox-th-border": "hsl(var(--gruvbox-th-border))",
        "gruvbox-td-border": "hsl(var(--gruvbox-td-border))",
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
} satisfies Config;
export default config;
