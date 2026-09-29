/**
 * Renders CMS article text safely (no HTML injection): blank-line separated paragraphs,
 * "## " / "### " headings, and "- " bullet lists.
 */
export function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="prose-school">
      {blocks.map((block, index) => {
        if (block.startsWith("### ")) return <h3 key={index}>{block.slice(4)}</h3>;
        if (block.startsWith("## ")) return <h2 key={index}>{block.slice(3)}</h2>;
        const lines = block.split("\n");
        if (lines.every((line) => /^[-*] /.test(line))) return <ul key={index}>{lines.map((line, i) => <li key={i}>{line.slice(2)}</li>)}</ul>;
        return <p key={index}>{lines.map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</p>;
      })}
    </div>
  );
}

export function readingMinutes(text: string) {
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
}
