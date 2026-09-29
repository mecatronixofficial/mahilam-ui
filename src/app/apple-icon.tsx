import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iOS/Android (the SVG favicon isn't used there). */
export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#f7c85b,#ef9e8a)" }}>
      <svg width="120" height="120" viewBox="0 0 64 64">
        <circle cx="23" cy="27" r="3.5" fill="#285744" />
        <circle cx="41" cy="27" r="3.5" fill="#285744" />
        <path d="M20 37c3.5 7 20.5 7 24 0" fill="none" stroke="#285744" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    </div>,
    size,
  );
}
