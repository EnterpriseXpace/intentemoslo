import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#faf9f6",
                foreground: "#161811",
                primary: {
                    DEFAULT: "#a6f20d",
                    foreground: "#161811",
                    hover: "#95da0b",
                },
                // Provisional premium dark navy - Pending final visual validation
                "brand-navy": "#0B1120",
                secondary: {
                    DEFAULT: "#f0efe9",
                    foreground: "#2d3126",
                },
                muted: {
                    DEFAULT: "#e8e7df",
                    foreground: "#4f5446",
                },
                card: {
                    DEFAULT: "#ffffff",
                    foreground: "#2d3126",
                    border: "#e2e6db",
                },
            },
            fontFamily: {
                sans: ["var(--font-noto-sans)", "sans-serif"],
                serif: ["var(--font-newsreader)", "serif"],
            },
            animation: {
                "loop-scroll": "loop-scroll 40s linear infinite",
            },
            keyframes: {
                "loop-scroll": {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-50%)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
