/** @type {import('tailwindcss').Config} */
// import animate from "tailwindcss-animate";
export default{
        
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                borderRadius: {
                        lg: '0px',
                        md: '0px',
                        sm: '2px',
                        none: '0px'
                },
                colors: {
                        primary: "#0055FF"
                                // DEFAULT: "hsl(var(--primary))",
                                // foreground: "hsl(var(--primary-foreground))",
                                // hover: '#0040CC',
                        ,
                        background: '#FFFFFF',
                        surface: '#F4F4F5',
                        surfaceHover: '#E4E4E7',
                        border: 'rgba(9, 9, 11, 0.1)',
                         
                        borderStrong: 'rgba(9, 9, 11, 0.8)',
                        text: {
                                primary: '#09090B',
                                secondary: '#71717A',
                                disabled: '#A1A1AA'
                        },
                        error: '#FF3B30',
                        success: '#34C759',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        }
                },
                fontFamily: {
                        heading: ['Chivo', 'sans-serif'],
                        body: ['DM Sans', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace']
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out'
                }
        }
  },
 
  plugins: [],
};
console.log("TAILWIND CONFIG LOADED");