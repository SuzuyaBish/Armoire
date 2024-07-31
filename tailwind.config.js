/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bgColor: "#0E0E0E",
        bgForegroundBg: "#E6E5DF",
        cardBg: "#FBFAF8",
        darkColor: "#30302E",
        muted: "#333",
        muted2: "#D0D0D0",
        muted3: "#61605E",
        mutedBg: "#E6E2DB",
        lightWhite: "#F8F7F3",
        purpleColor: "#8940FF",
        destructive: "#421C1B",
        destructiveText: "#FC2A2C",
        cosmosMuted: "#1D1D1D",
        cosmosMutedText: "#AAAAAA",
        cosmosOtherMuted: "#191919",
      },
    },
  },
  plugins: [],
};
