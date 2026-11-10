// Render scene.html frame-by-frame with headless Chromium and pipe PNGs to ffmpeg.
// Usage: node frames.js <out.mp4> [fps]   |  node frames.js --stills <dir> t1 t2 ...  (optional timing.json overrides scene start times)
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs"), path = require("path");

(async () => {
  const args = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const timing = fs.existsSync(path.join(__dirname, "timing.json")) ? fs.readFileSync(path.join(__dirname, "timing.json"), "utf8") : null;
  if (timing) await page.addInitScript(`window.TIMING = ${timing};`);
  if (process.env.SUBS === "1") await page.addInitScript(`window.SHOW_SUBS = true;`);
  page.on("console", m => console.log("[page]", m.text()));
  page.on("pageerror", e => { console.error("[page error]", e.message); process.exit(1); });
  await page.goto("file://" + path.join(__dirname, "scene.html"));
  await page.evaluate(() => window.ready);

  if (args[0] === "--stills") {
    const dir = args[1]; fs.mkdirSync(dir, { recursive: true });
    for (const t of args.slice(2)) {
      await page.evaluate(t => render(t), +t);
      await page.screenshot({ path: path.join(dir, `t${(+t).toFixed(2)}.png`) });
    }
  } else {
    const out = args[0], fps = +(args[1] || 30), total = Math.round(20 * fps);
    const ff = spawn("ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
      "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out],
      { stdio: ["pipe", "inherit", "inherit"] });
    for (let f = 0; f < total; f++) {
      await page.evaluate(t => render(t), f / fps);
      const buf = await page.screenshot({ type: "png" });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
      if (f % 60 === 0) console.log(`frame ${f}/${total}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on("close", r));
  }
  await browser.close();
})();
