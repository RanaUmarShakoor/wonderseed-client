/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "360px",
      sm: "640px",
      md: "768px",
      tb: "816px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    },
    extend: {
      colors: {
        green: {
          1: "#06755F",
          2: "#337360",
          3: "#91AC58",
          4: "#81AE38"
        },
        grey: {
          1: "#193A32"
        }
      },
      borderRadius: {
        "2.5xl": "18px"
      }
    }
  },
  plugins: []
};
