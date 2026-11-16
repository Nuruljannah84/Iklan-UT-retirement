// Rakam index.html menjadi MP4 1080x1920 @30fps.
// Guna:  node render.js [output.mp4]          -> video penuh
//        node render.js --stills 1,15,47 dir   -> PNG pada saat tertentu (untuk semakan)
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const FPS = 30;
const args = process.argv.slice(2);
const page_url = "file://" + path.join(__dirname, "index.html") + "?render";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto(page_url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const duration = await page.evaluate(() => window.DURATION);

  if (args[0] === "--stills") {
    const times = args[1].split(",").map(Number);
    const dir = args[2] || ".";
    fs.mkdirSync(dir, { recursive: true });
    for (const t of times) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(dir, `still-${String(t).padStart(5, "0")}.png`) });
    }
    await browser.close();
    return;
  }

  const out = args[0] || path.join(__dirname, "agihan-gaji-50-10.mp4");
  const ff = spawn("ffmpeg", ["-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", String(FPS),
    "-c:a", "aac", "-shortest", "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });

  const frames = Math.round(duration * FPS);
  for (let f = 0; f < frames; f++) {
    await page.evaluate(t => window.render(t), f / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (f % 150 === 0) process.stderr.write(`frame ${f}/${frames}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on("close", r));
  await browser.close();
  console.log("Siap:", out);
})();
