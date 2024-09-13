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
        body: ['Poppins', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
        accent: ['Montserrat', 'sans-serif']
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
        // Colors
        primary: '#0b9c09', // Main green color for primary actions
        'primary-foreground': '#ffffff', // White for text on primary buttons
        secondary: '#FFC107', // Secondary color (yellow)
        'secondary-foreground': '#333333', // Dark color for text on secondary buttons
        destructive: '#dc3545', // Red for destructive actions
        'destructive-foreground': '#ffffff', // White for text on destructive buttons
        accent: '#f1c40f', // Accent color, like yellow or orange
        'accent-foreground': '#333333', // Dark text for accent backgrounds
        input: '#d1d1d1', // Gray border for outline variant
        background: '#f0f0f0', // Background color for outline button
        'text-primary': '#0b9c09', // Link variant uses primary color for text
        complementary: '#9c0b9c',
        lightGreen: '#6dbb67',

        // Basics
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
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
