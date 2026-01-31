/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  			heading: ['var(--font-heading)', 'ui-serif', 'Georgia', 'serif'],
  			accent: ['var(--font-body)', 'ui-sans-serif', 'sans-serif']
  		},
  		fontSize: {
  			sm: 'clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem)',
  			base: 'clamp(1rem, 0.34vw + 0.91rem, 1.19rem)',
  			lg: 'clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem)',
  			label: 'clamp(1rem, 1vw + 1.31rem, 1.2rem)',
  			'sub-title': 'clamp(1rem, 1.56vw + 1.56rem, 1.25rem)',
  			title: 'clamp(2.44rem, 2.38vw + 1.85rem, 2.8rem)',
  			features: 'clamp(3.05rem, 3.54vw + 2.17rem, 5rem)',
  			section: 'clamp(3.81rem, 5.18vw + 2.52rem, 4rem)',
  			hero: 'clamp(4.77rem, 7.48vw + 2.9rem, 6rem)'
  		},
  		colors: {
  			primary: '#0b9c09',
  			'primary-foreground': '#ffffff',
  			secondary: '#FFC107',
  			'secondary-foreground': '#333333',
  			destructive: '#dc3545',
  			'destructive-foreground': '#ffffff',
  			accent: '#f1c40f',
  			'accent-foreground': '#333333',
  			input: '#d1d1d1',
  			background: '#f0f0f0',
  			'text-primary': '#0b9c09',
  			complementary: '#9c0b9c',
  			lightGreen: '#6dbb67',
  			darkGreen: '#054704',
  			lightGray: '#f0f0f0',
  			mediumGray: '#d1d1d1',
  			darkGray: '#333333',
  			white: '#ffffff'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
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
			},
			marquee: {
				'0%': { transform: 'translateX(0%)' },
				'100%': { transform: 'translateX(-100%)' }
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			marquee: 'marquee 30s linear infinite'
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
