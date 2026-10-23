# Responsive verification

Run `bun run build`, then `bun tests/responsive-browser.mjs`.

The Chrome audit starts a local production server and a fixture API. It does not change school records or upload photos. It requires Chrome at its standard Windows path, or `CRM_CHROME_PATH` pointing to Chrome.

Coverage:

- 15 public routes and four Home, About and website photo CMS editors.
- Widths: 320, 360, 375, 390, 414, 600, 640, 768, 820, 912, 1024, 1280, 1440, 1536, 1920 and 2560 pixels.
- Top, middle and bottom layout checks for horizontal overflow and clipped text.
- Phone and tablet portrait, 844 × 390 landscape, 1024 × 768 tablet landscape and 1280 × 720 desktop interactions.
- Menu scrolling, Escape and focus restoration, CMS navigation, touch field text size, photo viewer captions and login scrolling.

Results are written to `docs/responsive-verification.json`. The report includes the temporary screenshot folder. Set `RESPONSIVE_WIDTHS=320,768,1440` for a smaller width sweep, or `RESPONSIVE_INTERACTIONS_ONLY=1` to run the interaction checks alone.

The updates let the parent review form and activity labels fit small phones, place photo captions below the image, make short menus more usable, allow the login page to scroll, and enlarge compact CMS fields and primary controls on touch screens.

These are Chrome viewport and touch emulation checks. Physical device and Safari checks remain separate.
