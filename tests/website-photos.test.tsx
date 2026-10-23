import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { SCHOOL_PHOTOS, WEBSITE_PHOTO_SLOTS, schoolAlbums, websitePhotoKey } from "../src/lib/school-photos";
import { resolveWebsitePhoto, websitePhotoSettings } from "../src/lib/website-photos";
import SchoolImage, { WebsitePhotoProvider } from "../src/components/media/SchoolImage";

test("all 60 supplied photographs have valid local assets and appear exactly once in gallery albums", () => {
  assert.equal(SCHOOL_PHOTOS.length, 60);
  const items = schoolAlbums().flatMap(album => album.items);
  assert.equal(items.length, 60);
  assert.equal(new Set(items.map(item => item.id)).size, 60);
  for (const photo of SCHOOL_PHOTOS) {
    const filename = join(process.cwd(), "public", photo.src);
    assert.ok(existsSync(filename), photo.id);
    const buffer = readFileSync(filename);
    assert.equal(buffer.subarray(8, 12).toString(), "WEBP");
    assert.ok(photo.width > 0 && photo.height > 0);
    assert.ok(photo.alt.length > 10);
  }
});

test("every website position has a matching supplied asset without inventing founder portraits", () => {
  assert.equal(WEBSITE_PHOTO_SLOTS.length, 58);
  assert.equal(new Set(WEBSITE_PHOTO_SLOTS.map(slot => slot.sourcePath)).size, 58);
  for (const slot of WEBSITE_PHOTO_SLOTS) {
    assert.ok(SCHOOL_PHOTOS.some(photo => photo.id === slot.photoId), slot.id);
    assert.ok(existsSync(join(process.cwd(), "public", slot.sourcePath)), slot.id);
    assert.ok(!/founder|ramya|sneha/i.test(slot.id));
  }
});

test("website upload settings replace only their position and reject unsafe URLs", () => {
  const [first, second] = WEBSITE_PHOTO_SLOTS;
  const settings = { [websitePhotoKey(first.group)]: { images: { [first.id]: { url: "https://cdn.example.com/class.webp", alt: "Our new classroom" } } }, "school.phone": "private-to-photo-context" };
  assert.deepEqual(Object.keys(websitePhotoSettings(settings)), [websitePhotoKey(first.group)]);
  assert.equal(resolveWebsitePhoto(settings, first.sourcePath).src, "https://cdn.example.com/class.webp");
  assert.equal(resolveWebsitePhoto(settings, first.sourcePath).alt, "Our new classroom");
  assert.equal(resolveWebsitePhoto(settings, second.sourcePath).src, second.sourcePath);
  assert.equal(resolveWebsitePhoto({ [websitePhotoKey(first.group)]: { images: { [first.id]: { url: "javascript:alert(1)" } } } }, first.sourcePath).src, first.sourcePath);
  assert.deepEqual(resolveWebsitePhoto(settings, "/logo/mahilam.png", "School logo"), { src: "/logo/mahilam.png", alt: "School logo" });
});

test("registered page photos render CMS uploads from unconfigured CDN hosts with correct alt text", () => {
  const slot = WEBSITE_PHOTO_SLOTS[0];
  const settings = { [websitePhotoKey(slot.group)]: { images: { [slot.id]: { url: "https://new-cdn.example.com/school.webp", alt: "Updated school classroom" } } } };
  const html = renderToStaticMarkup(<WebsitePhotoProvider settings={settings}><SchoolImage src={slot.sourcePath} alt="Original" fill /></WebsitePhotoProvider>);
  assert.ok(html.includes('src="https://new-cdn.example.com/school.webp"'));
  assert.ok(html.includes('alt="Updated school classroom"'));
});
