"use client";
import { contentText, type SectionContent } from "@/lib/page-content";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { fx } from "@/components/animations/fx";
import { Puzzle, RotateCcw, Star } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { SECTION_BG, StarDoodle, Wave } from "./Doodles";

const FRIENDS = [
  { emoji: "🦁", name: "lion", tint: BRAND.yellow[100] },
  { emoji: "🐘", name: "elephant", tint: BRAND.blue[100] },
  { emoji: "🐰", name: "bunny", tint: BRAND.pink[50] },
  { emoji: "🦒", name: "giraffe", tint: BRAND.coral[100] },
  { emoji: "🐵", name: "monkey", tint: BRAND.green[100] },
  { emoji: "🌈", name: "rainbow", tint: BRAND.yellow[50] },
];
const BACKS = [BRAND.coral[300], BRAND.yellow[400], BRAND.green[300], BRAND.blue[300]];
const CONFETTI = [BRAND.yellow[400], BRAND.coral[400], BRAND.green[400], BRAND.blue[400], BRAND.pink[400]];

type Card = { id: number; friend: number };

/** Server renders the deck in order (so hydration matches); it is shuffled on the client after mount. */
const orderedDeck = (): Card[] => FRIENDS.flatMap((_, friend) => [{ id: friend * 2, friend }, { id: friend * 2 + 1, friend }]);
const shuffled = () => {
  const deck = orderedDeck();
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

/** Compact memory game: flip two cards, find the matching animal friends. React state only. */
export function MemoryMatchGame({ content }: { content?: SectionContent } = {}) {
  const [deck, setDeck] = useState<Card[]>(orderedDeck);
  const [open, setOpen] = useState<number[]>([]); // indexes of face-up, unmatched cards (max 2)
  const [matched, setMatched] = useState<number[]>([]); // friend ids
  const [moves, setMoves] = useState(0);
  const [round, setRound] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setDeck(shuffled());
    return () => window.clearTimeout(timer.current);
  }, []);

  const won = matched.length === FRIENDS.length;
  const stars = moves <= 8 ? 3 : moves <= 12 ? 2 : 1;

  const flip = (index: number) => {
    if (open.length === 2 || open.includes(index) || matched.includes(deck[index].friend)) return;
    const next = [...open, index];
    setOpen(next);
    if (next.length < 2) return;

    setMoves((n) => n + 1);
    const [a, b] = next.map((i) => deck[i].friend);
    timer.current = window.setTimeout(() => {
      if (a === b) setMatched((list) => [...list, a]);
      setOpen([]);
    }, a === b ? 350 : 850);
  };

  const replay = () => {
    window.clearTimeout(timer.current);
    setDeck(shuffled());
    setOpen([]);
    setMatched([]);
    setMoves(0);
    setRound((r) => r + 1);
  };

  return (
    <section className="relative overflow-hidden pb-20 pt-10 md:pb-24 md:pt-12" style={{ background: SECTION_BG.mint }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <StarDoodle className="absolute left-[6%] top-10 w-6 animate-twinkle" />
        <StarDoodle color={BRAND.pink[200]} className="absolute right-[8%] bottom-24 w-5 animate-twinkle [animation-delay:-1.4s]" />
      </div>

      <div className="container-pad relative">
        <div className="relative mx-auto grid max-w-4xl items-center gap-8 rounded-[36px] bg-white/70 p-5 shadow-[0_24px_50px_-36px_rgba(36,68,32,.5)] ring-1 ring-white sm:p-8 md:grid-cols-[1fr_320px] md:gap-10 lg:grid-cols-[1fr_360px]">
          {/* Copy + score */}
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-little-green-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800">
              <Puzzle className="h-3.5 w-3.5" /> {contentText(content, "eyebrow") || "Little Game"}
            </span>
            <h2 className="mt-3 font-display text-[1.7rem] font-bold leading-tight text-little-green-950 sm:text-3xl">{contentText(content, "heading") || <>
              Match the <span className="text-little-coral-500">animal friends!</span>
            </>}</h2>

            <div className="mt-2 min-h-[4.5rem]" aria-live="polite">
                {won ? (
                  <div key="won" data-in="" className="fx" style={fx({ y: 10, s: 0.95, dur: 0.6, ease: "back" })}>
                    <p className="font-display text-xl font-bold text-little-green-950">🎉 Yay! You found all the friends!</p>
                    <p className="mt-0.5 text-sm text-little-neutral-600">Learning is always fun at Little Mahilam.</p>
                  </div>
                ) : (
                  <p key="play" className="animate-[fx-fade_.3s] text-[15px] leading-7 text-little-neutral-600">
                    Flip two cards at a time and find each pair. Can you do it in 8 moves?
                  </p>
                )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
              <span className="rounded-full bg-little-yellow-100 px-3.5 py-1.5 text-sm font-extrabold tabular-nums text-little-green-900">Moves: {moves}</span>
              <span className="rounded-full bg-little-blue-100 px-3.5 py-1.5 text-sm font-extrabold tabular-nums text-little-green-900">Pairs: {matched.length}/{FRIENDS.length}</span>
              {won && (
                <span data-in="" className="fx flex gap-0.5" aria-label={`${stars} out of 3 stars`} style={fx({ s: 0, o: 1, dur: 0.5, ease: "back-strong" })}>
                  {[0, 1, 2].map((s) => <Star key={s} className={`h-5 w-5 ${s < stars ? "fill-little-yellow-400 text-little-yellow-500" : "text-little-neutral-300"}`} />)}
                </span>
              )}
            </div>
            <button type="button" onClick={replay} className="mt-4 inline-flex items-center gap-2 rounded-full bg-little-green-900 px-5 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5">
              <RotateCcw className="h-4 w-4" /> {won ? "Play again" : "Shuffle"}
            </button>
          </div>

          {/* Board */}
          <div className="relative mx-auto w-full max-w-[360px]">
            <ul className="grid grid-cols-4 gap-2 [perspective:900px] sm:gap-2.5">
              {deck.map((card, index) => {
                const friend = FRIENDS[card.friend];
                const isMatched = matched.includes(card.friend);
                const faceUp = isMatched || open.includes(index);
                return (
                  <li key={`${round}-${card.id}`}>
                    <button
                      type="button"
                      onClick={() => flip(index)}
                      disabled={faceUp}
                      aria-label={faceUp ? friend.name : `Card ${index + 1}, face down`}
                      className={`relative block aspect-square w-full rounded-2xl outline-none transition-[transform,translate,scale] duration-500 ease-(--ease-back) [transform-style:preserve-3d] focus-visible:ring-4 focus-visible:ring-little-blue-300 disabled:cursor-default ${faceUp ? "" : "hover:-translate-y-[3px] active:scale-[.94]"} ${isMatched ? "animate-[fx-pulse_.35s_ease-in-out_.25s]" : ""}`}
                      style={{ transform: faceUp ? "rotateY(180deg)" : undefined }}
                    >
                      {/* Back */}
                      <span
                        aria-hidden
                        className="absolute inset-0 grid place-items-center rounded-2xl shadow-[inset_0_-5px_0_rgba(0,0,0,.12),0_8px_14px_-10px_rgba(36,68,32,.6)] [backface-visibility:hidden]"
                        style={{ background: BACKS[index % BACKS.length] }}
                      >
                        <span className="font-display text-xl font-bold text-white/90">?</span>
                      </span>
                      {/* Face */}
                      <span
                        aria-hidden
                        className={`absolute inset-0 grid place-items-center rounded-2xl text-3xl ring-2 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:text-4xl ${isMatched ? "ring-little-green-400" : "ring-white"}`}
                        style={{ background: friend.tint }}
                      >
                        {friend.emoji}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {won && <Confetti key={round} />}
          </div>
        </div>
      </div>

      <Wave color={SECTION_BG.sky} flip className="absolute inset-x-0 bottom-0 h-12" />
    </section>
  );
}

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 420,
    y: -(80 + Math.random() * 140),
    rotate: (Math.random() - 0.5) * 600,
    color: CONFETTI[i % CONFETTI.length],
    round: i % 3 === 0,
    delay: Math.random() * 0.15,
  })), []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`fx-confetti absolute left-1/2 top-1/2 h-2.5 ${p.round ? "w-2.5 rounded-full" : "w-1.5 rounded-sm"}`}
          style={{ background: p.color, "--cx": `${p.x}px`, "--cy": `${p.y}px`, "--cr": `${p.rotate}deg`, "--fx-d": `${p.delay}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}
