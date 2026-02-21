/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-blue': '#1a365d',
                'brand-light': '#ebf8ff',
                'brand-accent': '#3182ce',
            },
        },
    },
    plugins: [],
}
