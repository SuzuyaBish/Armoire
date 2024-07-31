/** @type {import("prettier").Config} */
const config = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: false,
  singleQuote: false,
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
};

module.exports = config;
