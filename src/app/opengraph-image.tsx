import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const alt = "Little Mahilam Preschool, Tiruppur — A School of Happiness";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "linear-gradient(135deg,#fdf4e1,#f8f7f2 55%,#f8f7f2)", padding: 72, color: BRAND.green[900], fontFamily: "Arial" }}>
      <div style={{ position: "absolute", top: -120, left: -80, width: 420, height: 420, borderRadius: 420, background: "rgba(240,206,52,.45)" }} />
      <div style={{ position: "absolute", bottom: -140, right: -60, width: 460, height: 460, borderRadius: 460, background: "rgba(247,159,145,.4)" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", padding: 56, borderRadius: 48, background: "rgba(255,255,255,.62)", border: "2px solid rgba(255,255,255,.9)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 30, fontWeight: 700, color: BRAND.green[800] }}>
          <div style={{ width: 76, height: 76, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 24, background: "linear-gradient(135deg,#f0ce34,#f79f91)", fontSize: 44 }}>☺</div>
          Little Mahilam Preschool
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, lineHeight: 0.95, letterSpacing: -3, fontWeight: 900 }}>A School of Happiness</div>
          <div style={{ marginTop: 24, fontSize: 32, color: BRAND.neutral[600] }}>Play Group · Pre-KG · LKG · UKG · Grades 1–3</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: BRAND.green[700] }}>Kangayam Road, Tiruppur · Admissions open</div>
      </div>
    </div>,
    size,
  );
}
