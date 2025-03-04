/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "steam-1": {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: 0 },
          "50%": { transform: "translateY(-10px) scale(1.2)", opacity: 0.7 },
        },
        "steam-2": {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: 0 },
          "50%": { transform: "translateY(-12px) scale(1.3)", opacity: 0.7 },
        },
        "steam-3": {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: 0 },
          "50%": { transform: "translateY(-8px) scale(1.1)", opacity: 0.7 },
        },
        "speech-bubble-rotate": {
          "0%": { transform: "translate(-120%, -80%) rotate(-5deg)", opacity: 0.9 },
          "20%": { transform: "translate(-140%, -90%) rotate(-10deg)", opacity: 1 },
          "40%": { transform: "translate(-130%, -100%) rotate(-5deg)", opacity: 0.9 },
          "60%": { transform: "translate(30%, -90%) rotate(5deg)", opacity: 0.8 },
          "80%": { transform: "translate(40%, -80%) rotate(10deg)", opacity: 0.9 },
          "100%": { transform: "translate(-120%, -80%) rotate(-5deg)", opacity: 0.9 },
        },
        "speech-bubble-fade": {
          "0%, 100%": { opacity: 0 },
          "15%, 85%": { opacity: 1 },
        },
        "knife-chop": {
          "0%": { transform: "translateY(-15px) rotate(-10deg)" },
          "30%": { transform: "translateY(0) rotate(0deg)" },
          "40%": { transform: "translateY(0) rotate(0deg)" },
          "70%": { transform: "translateY(-15px) rotate(-10deg)" },
          "100%": { transform: "translateY(-15px) rotate(-10deg)" },
        },
        "board-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "30%, 40%": { transform: "translateX(-2px)" },
          "35%": { transform: "translateX(2px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "steam-1": "steam-1 2s ease-out infinite",
        "steam-2": "steam-2 2.3s ease-out infinite",
        "steam-3": "steam-3 1.7s ease-out infinite",
        "speech-bubble": "speech-bubble-rotate 5s ease-in-out infinite, speech-bubble-fade 5s ease-in-out infinite",
        "knife-chop": "knife-chop 1.5s ease-in-out infinite",
        "board-shake": "board-shake 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

