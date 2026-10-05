/* Cartoon animals for the homepage hero's hide-and-seek decorations. Purely decorative (aria-hidden). */

type Props = { className?: string };

export function Lion({ className }: Props) {
  const mane = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return { cx: 100 + Math.cos(a) * 64, cy: 100 + Math.sin(a) * 64 };
  });
  return (
    <svg aria-hidden className={className} viewBox="0 0 200 200">
      {mane.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r="22" fill="#e07b2c" />)}
      <circle cx="100" cy="100" r="70" fill="#e8892f" />
      <circle cx="60" cy="52" r="16" fill="#f6b041" /><circle cx="60" cy="52" r="8" fill="#f9d18a" />
      <circle cx="140" cy="52" r="16" fill="#f6b041" /><circle cx="140" cy="52" r="8" fill="#f9d18a" />
      <circle cx="100" cy="106" r="52" fill="#f8bb4a" />
      <path d="M72 86 Q82 80 92 86 M108 86 Q118 80 128 86" stroke="#9a5a22" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="82" cy="99" r="7.5" fill="#2b2118" /><circle cx="84.5" cy="96" r="2.5" fill="#fff" />
      <circle cx="118" cy="99" r="7.5" fill="#2b2118" /><circle cx="120.5" cy="96" r="2.5" fill="#fff" />
      <ellipse cx="68" cy="120" rx="9" ry="5.5" fill="#f28b7d" opacity=".55" />
      <ellipse cx="132" cy="120" rx="9" ry="5.5" fill="#f28b7d" opacity=".55" />
      <ellipse cx="100" cy="130" rx="27" ry="19" fill="#fde4b0" />
      <path d="M90 116 Q100 111 110 116 Q105 126 100 126 Q95 126 90 116Z" fill="#7a3e1d" />
      <path d="M100 126 Q100 134 91 136 M100 126 Q100 134 109 136" stroke="#7a3e1d" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="84" cy="130" r="1.6" fill="#c08850" /><circle cx="80" cy="136" r="1.6" fill="#c08850" />
      <circle cx="116" cy="130" r="1.6" fill="#c08850" /><circle cx="120" cy="136" r="1.6" fill="#c08850" />
      {/* paw gripping the edge */}
      <g transform="translate(166 150) rotate(-20)">
        <ellipse rx="22" ry="17" fill="#f8bb4a" stroke="#e8892f" strokeWidth="3" />
        <path d="M-7 -14 V-4 M5 -14 V-4" stroke="#d98a2e" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function Monkey({ className }: Props) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 160 220">
      <path d="M0 14 Q80 2 160 16" stroke="#7a4a26" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="22" cy="20" rx="12" ry="6" fill="#5fae6e" transform="rotate(25 22 20)" />
      <ellipse cx="138" cy="22" rx="12" ry="6" fill="#5fae6e" transform="rotate(-25 138 22)" />
      <ellipse cx="52" cy="6" rx="10" ry="5" fill="#7cc58a" transform="rotate(-15 52 6)" />
      {/* hanging upside down by the tail */}
      <path d="M84 98 C100 70 68 52 90 28 C100 16 92 4 80 12" stroke="#8b5a35" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M68 100 L54 78 M92 100 L106 78" stroke="#8b5a35" strokeWidth="10" strokeLinecap="round" />
      <circle cx="52" cy="74" r="7" fill="#f2c9a0" /><circle cx="108" cy="74" r="7" fill="#f2c9a0" />
      <ellipse cx="80" cy="118" rx="22" ry="26" fill="#8b5a35" />
      <ellipse cx="80" cy="120" rx="13" ry="16" fill="#f2c9a0" />
      <path d="M62 132 Q48 150 44 166 M98 132 Q112 150 116 166" stroke="#8b5a35" strokeWidth="9" strokeLinecap="round" fill="none" />
      <circle cx="44" cy="170" r="7" fill="#f2c9a0" /><circle cx="116" cy="170" r="7" fill="#f2c9a0" />
      <circle cx="48" cy="172" r="13" fill="#8b5a35" /><circle cx="48" cy="172" r="7" fill="#f2c9a0" />
      <circle cx="112" cy="172" r="13" fill="#8b5a35" /><circle cx="112" cy="172" r="7" fill="#f2c9a0" />
      <circle cx="80" cy="172" r="32" fill="#8b5a35" />
      <path d="M72 203 L76 212 L80 204 L84 212 L88 203" fill="#8b5a35" />
      <ellipse cx="80" cy="164" rx="24" ry="17" fill="#f2c9a0" />
      <circle cx="70" cy="182" r="12" fill="#f2c9a0" /><circle cx="90" cy="182" r="12" fill="#f2c9a0" />
      <circle cx="70" cy="183" r="4.5" fill="#2b2118" /><circle cx="90" cy="183" r="4.5" fill="#2b2118" />
      <circle cx="71.5" cy="185" r="1.5" fill="#fff" /><circle cx="91.5" cy="185" r="1.5" fill="#fff" />
      <circle cx="76" cy="170" r="1.7" fill="#5a3a22" /><circle cx="84" cy="170" r="1.7" fill="#5a3a22" />
      <path d="M69 159 Q80 150 91 159" stroke="#5a3a22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="60" cy="168" rx="5" ry="3.5" fill="#f28b7d" opacity=".55" />
      <ellipse cx="100" cy="168" rx="5" ry="3.5" fill="#f28b7d" opacity=".55" />
    </svg>
  );
}

export function Elephant({ className }: Props) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 200 180">
      <ellipse cx="40" cy="86" rx="42" ry="52" fill="#8aa0b5" />
      <ellipse cx="42" cy="88" rx="28" ry="38" fill="#f4b6b0" />
      <circle cx="78" cy="90" r="56" fill="#a3b8cb" />
      <path d="M118 96 C148 102 160 86 164 58 C166 46 180 47 179 60 C176 106 148 130 112 124Z" fill="#a3b8cb" />
      <path d="M150 104 Q156 100 160 92 M140 112 Q147 109 152 102" stroke="#8aa0b5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M112 118 Q122 128 132 122" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="102" cy="76" r="7" fill="#2b2118" /><circle cx="104.5" cy="73" r="2.4" fill="#fff" />
      <path d="M94 64 Q102 58 110 63" stroke="#6f8599" strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse cx="106" cy="100" rx="9" ry="5.5" fill="#f28b7d" opacity=".55" />
      <path d="M90 126 Q98 134 108 128" stroke="#5c7186" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="176" cy="38" r="5" fill="#8fd3f4" /><circle cx="188" cy="26" r="3.5" fill="#8fd3f4" /><circle cx="166" cy="26" r="3" fill="#8fd3f4" />
    </svg>
  );
}

export function Giraffe({ className }: Props) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 120 220">
      <rect x="44" y="84" width="32" height="150" rx="14" fill="#f5c451" />
      <rect x="50" y="110" width="12" height="16" rx="6" fill="#d9893a" />
      <rect x="62" y="140" width="11" height="14" rx="5" fill="#d9893a" />
      <rect x="48" y="170" width="13" height="15" rx="6" fill="#d9893a" />
      <rect x="62" y="198" width="10" height="14" rx="5" fill="#d9893a" />
      <path d="M48 46 L44 22 M72 46 L76 22" stroke="#d9893a" strokeWidth="5" strokeLinecap="round" />
      <circle cx="44" cy="20" r="6" fill="#b5652a" /><circle cx="76" cy="20" r="6" fill="#b5652a" />
      <ellipse cx="28" cy="56" rx="13" ry="6" fill="#f5c451" transform="rotate(-25 28 56)" />
      <ellipse cx="92" cy="56" rx="13" ry="6" fill="#f5c451" transform="rotate(25 92 56)" />
      <ellipse cx="60" cy="68" rx="30" ry="26" fill="#f5c451" />
      <circle cx="44" cy="52" r="5" fill="#d9893a" />
      <ellipse cx="60" cy="90" rx="22" ry="15" fill="#f9dc8c" />
      <circle cx="50" cy="66" r="5" fill="#2b2118" /><circle cx="51.5" cy="64" r="1.7" fill="#fff" />
      <circle cx="70" cy="66" r="5" fill="#2b2118" /><circle cx="71.5" cy="64" r="1.7" fill="#fff" />
      <circle cx="54" cy="88" r="2" fill="#9a5a22" /><circle cx="66" cy="88" r="2" fill="#9a5a22" />
      <path d="M52 97 Q60 103 68 97" stroke="#9a5a22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="38" cy="78" rx="5" ry="3.5" fill="#f28b7d" opacity=".55" />
      <ellipse cx="82" cy="78" rx="5" ry="3.5" fill="#f28b7d" opacity=".55" />
    </svg>
  );
}

export function Bunny({ className }: Props) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 100 110">
      <ellipse cx="34" cy="38" rx="11" ry="32" fill="#fff" stroke="#eadfd3" strokeWidth="2" transform="rotate(-12 34 38)" />
      <ellipse cx="34" cy="40" rx="5" ry="22" fill="#f6b8c0" transform="rotate(-12 34 40)" />
      <ellipse cx="66" cy="38" rx="11" ry="32" fill="#fff" stroke="#eadfd3" strokeWidth="2" transform="rotate(12 66 38)" />
      <ellipse cx="66" cy="40" rx="5" ry="22" fill="#f6b8c0" transform="rotate(12 66 40)" />
      <ellipse cx="50" cy="102" rx="36" ry="32" fill="#fff" stroke="#eadfd3" strokeWidth="2" />
      <circle cx="39" cy="92" r="4.5" fill="#2b2118" /><circle cx="61" cy="92" r="4.5" fill="#2b2118" />
      <circle cx="40.3" cy="90.5" r="1.5" fill="#fff" /><circle cx="62.3" cy="90.5" r="1.5" fill="#fff" />
      <path d="M46 101 Q50 105 54 101Z" fill="#f28b9a" />
      <ellipse cx="30" cy="102" rx="5" ry="3" fill="#f6b8c0" opacity=".7" />
      <ellipse cx="70" cy="102" rx="5" ry="3" fill="#f6b8c0" opacity=".7" />
    </svg>
  );
}
