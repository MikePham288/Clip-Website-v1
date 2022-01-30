module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx,vue}",
  ],
  safelist: ["bg-blue-500", "bg-emerald-500", "bg-red-500"],

  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      backgroundColor: ["disabled"],
    },
  },
  plugins: [],
};
