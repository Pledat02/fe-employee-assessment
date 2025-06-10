/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",  
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FD7E14', 
                    dark: '#1E40AF',  
                },
                secondary: {
                    DEFAULT: '#10B981', 
                },
            },
        },
    },
    plugins: [],

};

