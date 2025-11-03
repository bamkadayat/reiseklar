import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			// Custom Norwegian-themed color palette
  			'norwegian-blue': {
  				DEFAULT: '#01286d',
  				50: '#E6EBF5',
  				100: '#CCE0FF',
  				500: '#01286d',
  				600: '#01286d',
  				700: '#012050',
  			},
  			'klar-red': {
  				DEFAULT: '#7f1d1d',
  				50: '#fef2f2',
  				100: '#fee2e2',
  				500: '#991b1b',
  				600: '#7f1d1d',
  				700: '#6b1414',
  				900: '#7f1d1d',
  			},
  			'sky-blue': {
  				DEFAULT: '#4AA3FF',
  				light: '#76C6FF',
  			},
  			'red-accent': {
  				DEFAULT: '#D72828',
  			},
  			'transit-red': {
  				DEFAULT: '#7f1d1d',
  				light: '#991b1b',
  				dark: '#6b1414',
  			},
  			'neutral-light': {
  				DEFAULT: '#F9FAFB',
  			},
  			// shadcn/ui theme colors
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
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
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			sidebar: 'hsl(var(--sidebar))',
  			'sidebar-active': 'hsl(var(--sidebar-active))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		backgroundImage: {
  			'gradient-sky': 'linear-gradient(to right, #4AA3FF, #76C6FF)',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'fade-in': {
  				'0%': { opacity: '0', transform: 'translateY(10px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' },
  			},
  			blob: {
  				'0%': { transform: 'translate(0px, 0px) scale(1)' },
  				'33%': { transform: 'translate(30px, -50px) scale(1.1)' },
  				'66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
  				'100%': { transform: 'translate(0px, 0px) scale(1)' },
  			},
  		},
  		animation: {
  			'fade-in': 'fade-in 0.8s ease-out',
  			blob: 'blob 7s infinite',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
