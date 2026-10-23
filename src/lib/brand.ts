/**
 * Little Mahilam brand colours, taken from the official logo:
 *   green  #92ca7c · pink #eb4c99 · yellow #f0ce34 · blue (teal) #60c5c3   (the 400 steps, except pink = 500)
 * plus a coral accent, a warm neutral for text and a cream page background.
 *
 * The same values are defined as CSS tokens in app/globals.css (`--color-little-*`, used as Tailwind classes
 * such as `bg-little-green-700`). Use those classes in markup; use BRAND only where CSS variables can't reach:
 * SVG presentation attributes, generated images (OG/icons), the web manifest, charts and computed styles.
 */
export const BRAND = {
  green: { 50: "#f2f9ee", 100: "#e3f2db", 200: "#c9e6bb", 300: "#abd898", 400: "#92ca7c", 500: "#71b158", 600: "#539340", 700: "#3f7432", 800: "#305a27", 900: "#244420", 950: "#152a12" },
  pink: { 50: "#fdeef6", 100: "#fcdcec", 200: "#f9bbd9", 300: "#f592c2", 400: "#f06cab", 500: "#eb4c99", 600: "#d43282", 700: "#b02469", 800: "#8c1e54", 900: "#6e1a44", 950: "#420a26" },
  yellow: { 50: "#fefaeb", 100: "#fdf2c9", 200: "#fbe696", 300: "#f7d95f", 400: "#f0ce34", 500: "#dcb51c", 600: "#b98f13", 700: "#8f6b11", 800: "#6f5213", 900: "#5b4314", 950: "#352607" },
  blue: { 50: "#eefafa", 100: "#d5f2f1", 200: "#afe4e3", 300: "#86d5d4", 400: "#60c5c3", 500: "#40aaa9", 600: "#318a8b", 700: "#2a6f71", 800: "#265a5c", 900: "#224b4d", 950: "#112d2f" },
  coral: { 50: "#fef2f0", 100: "#fde1dc", 200: "#fbc3b9", 300: "#f79f91", 400: "#f27c6b", 500: "#e85e4b", 600: "#d24533", 700: "#ae3628", 800: "#8f2f25", 900: "#762b23", 950: "#40130e" },
  neutral: { 50: "#f8f7f2", 100: "#f0eee6", 200: "#e3e0d4", 300: "#cdc9ba", 400: "#a19e8e", 500: "#706e5e", 600: "#5c5b4d", 700: "#48483d", 800: "#33342b", 900: "#23251d", 950: "#151711" },
  cream: { 100: "#fdf4e1", 200: "#f8e9cc", base: "#fffaf0" },
  /** Body text and headings. */
  ink: "#244420",
  /** Secondary text. */
  muted: "#5c5b4d",
} as const;
