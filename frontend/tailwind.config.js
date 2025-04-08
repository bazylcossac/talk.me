module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
};
