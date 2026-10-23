/** Populate only website CMS photos. Default is read-only; use --apply for the requested import. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const backend = process.env.SCHOOL_BACKEND_ROOT || resolve(root, "../../Server/mahilam-server");
const load = path => import(pathToFileURL(join(backend, path)).href);
const { parse } = await load("node_modules/dotenv/lib/main.js");
const env = parse(readFileSync(join(backend, ".env")));
for (const [key, value] of Object.entries(env)) if (!process.env[key]) process.env[key] = value;
const photos = JSON.parse(readFileSync(join(root, "src/data/school-photos.json"), "utf8"));
const slots = JSON.parse(readFileSync(join(root, "src/data/website-photo-slots.json"), "utf8"));
const reportPath = join(root, "docs/school-photo-import.json");
const report = existsSync(reportPath) ? JSON.parse(readFileSync(reportPath, "utf8")) : { uploads: {} };
const persist = () => writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
const apply = process.argv.includes("--apply");
await load("node_modules/reflect-metadata/Reflect.js");
const { PrismaClient } = await load("dist/generated/prisma/client.js");
const { PrismaPg } = await load("node_modules/@prisma/adapter-pg/dist/index.mjs");
const { StorageService } = await load("dist/integrations/storage.service.js");
const storage = new StorageService();
const database = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const uuid = text => { const h = createHash("sha256").update("mahilam-school-photos:" + text).digest("hex"); return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`; };
try {
  await database.$connect();
  const [banners, programs, activities, facilities, settings] = await Promise.all([
    database.banner.findMany({ orderBy: { displayOrder: "asc" } }), database.program.findMany(), database.activity.findMany(), database.facility.findMany(),
    database.siteSetting.findMany({ where: { OR: [{ key: { startsWith: "public.page." } }, { key: { startsWith: "public.website.photos." } }] } }),
  ]);
  console.log(JSON.stringify({ mode: apply ? "apply" : "read-only", photos: photos.length, positions: slots.length, imageStorageConfigured: storage.status().configured, existing: { banners: banners.length, programs: programs.length, activities: activities.length, facilities: facilities.length }, groups: [...new Set(photos.map(photo => photo.category))] }));
  if (!apply) process.exitCode = 0;
  else {
    assert.ok(storage.status().configured, "Cloudflare R2 must be configured");
    const backupPath = join(root, "docs/school-photo-import-backup.json");
    if (!existsSync(backupPath)) writeFileSync(backupPath, JSON.stringify({ banners, programs, activities, facilities, settings }, null, 2) + "\n");
    let cursor = 0;
    async function uploadWorker() {
      while (cursor < photos.length) {
        const photo = photos[cursor++];
        const buffer = readFileSync(join(root, "public", photo.src));
        const digest = createHash("sha256").update(buffer).digest("hex");
        if (report.uploads[photo.id]?.digest !== digest) {
          const uploaded = await storage.uploadImage({ buffer, size: buffer.length, originalname: photo.id + ".webp", mimetype: "image/webp" });
          report.uploads[photo.id] = { ...uploaded, digest };
          persist();
        }
        const response = await fetch(report.uploads[photo.id].url, { method: "HEAD", signal: AbortSignal.timeout(15000) });
        assert.ok(response.ok && response.headers.get("content-type")?.startsWith("image/"), `Public image verification: ${photo.id}`);
        console.log(`Verified photo ${photo.id}`);
      }
    }
    await Promise.all([uploadWorker(), uploadWorker(), uploadWorker()]);
    const imageUrl = id => report.uploads[id].url;
    const slotUrl = id => imageUrl(slots.find(slot => slot.id === id).photoId);
    const categories = [...new Set(photos.map(photo => photo.category))];
    const facilitySeeds = [
      ["Welcoming classrooms", "Comfortable classrooms for group learning, conversation and discovery.", "facility-classrooms", "classroom"],
      ["Play spaces", "Purposeful play spaces for movement, sensory exploration and friendships.", "facility-play", "play"],
      ["Reading corners", "Classroom books and materials for stories, listening and language development.", "facility-reading", "book"],
      ["Activity zones", "Flexible spaces for creative projects, cooking activities and hands-on learning.", "facility-activities", "art"],
      ["Child-friendly design", "Welcoming classroom spaces arranged around young learners.", "facility-friendly", "safe"],
      ["Bright environment", "Colourful classrooms that encourage children to participate and explore.", "facility-bright", "sun"],
    ];
    const activitySeeds = [
      ["Art & Craft", "art-craft", "Children paint, cut, glue and create while exploring colour and materials.", "activity-art", "Creativity, fine motor skills, focus"],
      ["Music & Dance", "music-dance", "Songs, movement and performances help children express themselves with confidence.", "activity-music", "Expression, rhythm, confidence"],
      ["Outdoor Games", "outdoor-games", "Outdoor games encourage movement, coordination and taking turns.", "activity-outdoor", "Coordination, teamwork, movement"],
      ["Storytelling", "storytelling", "Stories and picture books help children discover language and imagination.", "activity-story", "Language, listening, imagination"],
      ["Sensory Play", "sensory-play", "Children pour, scoop and explore textures through hands-on sensory play.", "activity-sensory", "Curiosity, coordination, observation"],
      ["Nature Exploration", "nature-exploration", "Guided outdoor discovery helps children observe plants, animals and the world around them.", "activity-nature", "Observation, curiosity, care"],
    ];
    await database.$transaction(async tx => {
      for (const category of categories) {
        const slug = "school-photos-" + category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const album = await tx.galleryAlbum.upsert({ where: { slug }, create: { title: category, slug, category, active: true }, update: { active: true } });
        for (const [index, photo] of photos.filter(photo => photo.category === category).entries()) {
          const data = { albumId: album.id, imageUrl: imageUrl(photo.id), caption: photo.caption, altText: photo.alt, displayOrder: index, active: true };
          await tx.galleryItem.upsert({ where: { id: uuid(photo.id) }, create: { id: uuid(photo.id), ...data }, update: data });
        }
      }
      for (const group of [...new Set(slots.map(slot => slot.group))]) {
        const key = `public.website.photos.${group}`;
        const previous = settings.find(setting => setting.key === key)?.value;
        const value = { ...(previous && typeof previous === "object" ? previous : {}), text: {}, images: Object.fromEntries(slots.filter(slot => slot.group === group).map(slot => [slot.id, { url: imageUrl(slot.photoId), alt: photos.find(photo => photo.id === slot.photoId).alt }])) };
        await tx.siteSetting.upsert({ where: { key }, create: { key, value }, update: { value } });
      }
      // Retain all edited copy; route the existing default hero through the new page-photo setting.
      const home = settings.find(setting => setting.key === "public.page.home.hero");
      if (home && home.value && typeof home.value === "object") {
        const value = { ...home.value, images: { ...home.value.images, main: { url: "/images/home/hero.webp", alt: photos.find(photo => photo.id === "classroom-circle").alt } } };
        await tx.siteSetting.update({ where: { key: home.key }, data: { value } });
      }
      const bannerPhotos = ["classroom-circle", "sensory-garden-play", "happy-little-chefs"];
      for (const [index, banner] of banners.entries()) await tx.banner.update({ where: { id: banner.id }, data: { desktopImage: imageUrl(bannerPhotos[index % bannerPhotos.length]), mobileImage: imageUrl(bannerPhotos[index % bannerPhotos.length]) } });
      for (const program of programs) {
        const id = /play.group/i.test(program.name) ? "play-group" : /pre.?kg/i.test(program.name) ? "pre-kg" : /lkg|ukg|kindergarten/i.test(program.name) ? "kindergarten" : "primary";
        await tx.program.update({ where: { id: program.id }, data: { coverImage: slotUrl(id) } });
      }
      for (const [index, [title, description, slot, icon]] of facilitySeeds.entries()) {
        const existing = facilities.find(facility => facility.title.toLowerCase() === title.toLowerCase());
        if (existing) await tx.facility.update({ where: { id: existing.id }, data: { image: slotUrl(slot) } });
        else await tx.facility.create({ data: { title, description, image: slotUrl(slot), icon, displayOrder: index, active: true } });
      }
      for (const [index, [name, slug, description, slot, benefits]] of activitySeeds.entries()) {
        const existing = activities.find(activity => activity.slug === slug || activity.name.toLowerCase() === name.toLowerCase());
        if (existing) await tx.activity.update({ where: { id: existing.id }, data: { image: slotUrl(slot) } });
        else await tx.activity.create({ data: { name, slug, description, benefits, image: slotUrl(slot), displayOrder: index, active: true } });
      }
      for (const activity of activities.filter(activity => /^cook(?:ing)?$/i.test(activity.name))) await tx.activity.update({ where: { id: activity.id }, data: { image: imageUrl("pizza-making") } });
      await tx.auditLog.create({ data: { module: "cms", action: "SCHOOL_PHOTOS_IMPORTED", newValue: { photos: photos.length, albums: categories.length, positions: slots.length, source: "User-supplied school photography" } } });
    }, { timeout: 60000 });
    report.status = "imported";
    report.summary = { photos: photos.length, albums: categories.length, pagePhotoPositions: slots.length, banners: banners.length, programs: programs.length, facilities: facilitySeeds.length, activities: activitySeeds.length };
    report.completedAt = new Date().toISOString();
    persist();
    console.log(JSON.stringify(report.summary));
  }
} finally { await database.$disconnect(); }
