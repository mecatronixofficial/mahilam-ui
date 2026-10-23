import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { contentImage, contentKey, contentText, PAGE_SECTIONS, pageContent, parseSectionContent, safeContentImage } from "../src/lib/page-content";
import { AboutHero } from "../src/components/about/AboutHero";
import { WelcomeCollage } from "../src/components/public/WelcomeCollage";
import { HeroSlider } from "../src/components/public/HeroSlider";
import { SectionHeading } from "../src/components/about/motion";

const hero = PAGE_SECTIONS.about.find((section) => section.id === "hero")!;

test("page content isolates Home and About and tolerates missing or malformed settings", () => {
  for (const value of [null, undefined, false, "bad", [], { text: null, images: [1] }]) {
    assert.deepEqual(parseSectionContent(value, hero), { text: {}, images: {} });
  }
  const saved = { [contentKey("about", "hero")]: { text: { heading: " About title ", unknown: "private" }, images: {} } };
  assert.equal(contentText(pageContent(saved, "about").hero, "heading"), "About title");
  assert.equal(contentText(pageContent(saved, "home").hero, "heading"), undefined);
  assert.equal(pageContent(saved, "about").hero.text.unknown, undefined);
  assert.deepEqual(pageContent(null, "about").hero, { text: {}, images: {} });
});

test("invalid image URLs cannot replace built-in photos", () => {
  for (const url of ["javascript:alert(1)", "data:image/png;base64,xx", "//evil.example/photo.jpg", "/\\evil.example/photo.jpg", "https://user:password@example.com/p.jpg", "\n//evil.example/p.jpg", "https://example.com/a b.jpg", 123]) {
    assert.equal(safeContentImage(url), undefined, String(url));
    const content = parseSectionContent({ images: { main: { url } } }, hero);
    assert.equal(contentImage(content, "main", "/fallback.jpg", "Default photo").src, "/fallback.jpg");
  }
  for (const url of ["/imgs/home/kid1.jpg", "https://cdn.example.com/photo.webp", "http://localhost:4000/photo.jpg"]) assert.equal(safeContentImage(url), url);
});

test("partial overrides and restoring defaults retain each original photo and description", () => {
  const content = parseSectionContent({ text: { heading: " ", eyebrow: "Hello" }, images: { small: { url: "https://cdn.example.com/b.jpg", alt: " Small photo " }, unknown: { url: "/private.jpg" } } }, hero);
  assert.equal(contentText(content, "heading"), undefined);
  assert.deepEqual(contentImage(content, "small", "/fallback.jpg", "Default"), { src: "https://cdn.example.com/b.jpg", alt: "Small photo" });
  assert.deepEqual(contentImage(content, "main", "/fallback.jpg", "Default"), { src: "/fallback.jpg", alt: "Default" });
  assert.equal(content.images.unknown, undefined);
  const reset = parseSectionContent({ text: {}, images: {} }, hero);
  assert.deepEqual(contentImage(reset, "small", "/fallback.jpg", "Default"), { src: "/fallback.jpg", alt: "Default" });
});

test("About and Home photo components render uploaded images and accessible descriptions", () => {
  const content = parseSectionContent({ text: { heading: "Edited heading", eyebrow: "Edited label", description: "Edited description" }, images: { main: { url: "https://cdn.example.com/main.webp", alt: "Our school classroom" }, small: { url: "https://cdn.example.com/small.webp", alt: "Our playground" } } }, hero);
  for (const html of [renderToStaticMarkup(<AboutHero image="/original.jpg" imageAlt="Original" secondImage="/original-small.jpg" content={content} />), renderToStaticMarkup(<WelcomeCollage content={content} />)]) {
    assert.ok(html.includes('src="https://cdn.example.com/main.webp"'));
    assert.ok(html.includes('alt="Our school classroom"'));
    assert.ok(html.includes('src="https://cdn.example.com/small.webp"'));
    assert.ok(html.includes('alt="Our playground"'));
  }
  const about = renderToStaticMarkup(<AboutHero image="/original.jpg" imageAlt="Original" secondImage="/original-small.jpg" content={content} />);
  for (const text of ["Edited heading", "Edited label", "Edited description"]) assert.ok(about.includes(text));
  const heading = renderToStaticMarkup(<SectionHeading eyebrow="Original label" title="Original heading" lead="Original description" content={content} />);
  for (const text of ["Edited heading", "Edited label", "Edited description"]) assert.ok(heading.includes(text));
});

test("Home hero keeps published banners authoritative and uses editable default content otherwise", () => {
  const content = parseSectionContent({ text: { heading: "New default hero" }, images: { main: { url: "https://cdn.example.com/default.webp", alt: "Default classroom" } } }, PAGE_SECTIONS.home[0]);
  const fallback = renderToStaticMarkup(<HeroSlider banners={[]} content={content} />);
  assert.ok(fallback.replace(/<[^>]+>/g, "").includes("New default hero"));
  const original = renderToStaticMarkup(<HeroSlider banners={[]} />);
  assert.equal((original.match(/data-word=/g) || []).length, 4, "Default heading retains its word-by-word animation");
  assert.ok(fallback.includes('src="https://cdn.example.com/default.webp"'));
  const published = renderToStaticMarkup(<HeroSlider content={content} banners={[{ id: "banner", title: "Published school banner", desktopImage: "https://cdn.example.com/banner.webp", active: true }]} />);
  assert.ok(published.includes('src="https://cdn.example.com/banner.webp"'));
  assert.ok(!published.includes("New default hero"));
});


