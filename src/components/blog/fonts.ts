import { Fraunces } from "next/font/google";

/** Editorial serif for the Journal (blog list + articles) only — gives the magazine its own voice. */
export const journal = Fraunces({ subsets: ["latin"], weight: ["600", "700", "800"], style: ["normal", "italic"], display: "swap", preload: false });
