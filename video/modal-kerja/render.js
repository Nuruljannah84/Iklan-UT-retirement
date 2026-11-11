// Render scene.html kepada MP4 1080x1920 (9:16).
// Guna: node video/modal-kerja/render.js [output.mp4] [--preview t1,t2,...]
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");

const FPS = 30;
const dir = __dirname;
const args = process.argv.slice(2);
const previewIdx = args.indexOf("--preview");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto("file://" + path.join(dir, "scene.html") + "?render");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");

  if (previewIdx !== -1) {
    // Tangkap beberapa frame sahaja untuk semakan pantas
    const times = args[previewIdx + 1].split(",").map(Number);
    const outDir = args[previewIdx + 2] || dir;
    for (const t of times) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(outDir, `frame-${t}.png`) });
    }
    await browser.close();
    return;
  }

  const out = path.resolve(args[0] || path.join(dir, "modal-kerja-pks.mp4"));
  const duration = await page.evaluate(() => window.DURATION);
  const ff = spawn("ffmpeg", [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-shortest", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", out
  ], { stdio: ["pipe", "inherit", "inherit"] });

  const total = Math.round(duration * FPS);
  for (let i = 0; i < total; i++) {
    await page.evaluate(t => window.render(t), i / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (i % 90 === 0) process.stdout.write(`frame ${i}/${total}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on("close", r));
  await browser.close();
  console.log("Siap:", out);
})();
