/* =====================================================
   TETAPAN — tukar maklumat di bawah kepada maklumat anda
   ===================================================== */
const CONFIG = {
  brand: "Jannah Financial",               // Nama bisnes
  name: "Nurul Jannah Mahmud",             // Nama anda
  fimm: "F02024801",                       // No. pendaftaran FIMM (Unit Trust & PRS)
  takaful: "",                             // No. / kod ejen AIA PUBLIC Takaful (kosong = disembunyikan)
  whatsapp: "60123947764",                 // No. WhatsApp: kod negara 60, tanpa "+", tanpa sengkang
  defaultMessage: "Assalamualaikum, saya berminat nak tahu tentang perancangan kewangan."
};

/* ===================================================== */

const $ = id => document.getElementById(id);
const rm = n => "RM " + Math.round(n).toLocaleString("en-MY");
const waLink = msg => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

// Masukkan maklumat CONFIG ke dalam halaman
document.querySelectorAll("[data-config]").forEach(el => {
  const value = CONFIG[el.dataset.config];
  if (value) el.textContent = value;
});
// Sembunyikan elemen jika maklumat berkaitan masih kosong
document.querySelectorAll("[data-requires]").forEach(el => {
  if (!CONFIG[el.dataset.requires]) el.hidden = true;
});
if ($("year")) $("year").textContent = new Date().getFullYear();

// Pautan WhatsApp — guna data-wa="mesej khas" atau biarkan kosong untuk mesej asal
document.querySelectorAll("[data-wa]").forEach(el => {
  el.href = waLink(el.dataset.wa || CONFIG.defaultMessage);
  el.target = "_blank";
  el.rel = "noopener";
});

// Menu telefon
const menuBtn = $("menuBtn");
const navLinks = $("navLinks");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  navLinks.addEventListener("click", e => {
    if (e.target.closest("a")) {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------- Semakan kesihatan kewangan (laman utama) ---------- */
const checkForm = $("healthCheck");
if (checkForm) {
  const boxes = [...checkForm.querySelectorAll("input[type=checkbox]")];
  const update = () => {
    const done = boxes.filter(b => b.checked).length;
    const pct = Math.round((done / boxes.length) * 100);
    $("scoreRing").style.setProperty("--p", pct);
    $("scoreNum").textContent = `${done}/${boxes.length}`;
    let msg;
    if (done === boxes.length) msg = "Tahniah! Asas kewangan anda kukuh. Jom semak sama ada ia masih sesuai.";
    else if (done >= 4) msg = "Bagus! Ada beberapa ruang lagi yang boleh diperkukuhkan.";
    else if (done >= 2) msg = "Anda dah mula, tapi ada jurang penting yang perlu ditutup.";
    else msg = "Jangan risau, ramai bermula di sini. Jom rancang bersama.";
    $("scoreMsg").textContent = msg;
    const missing = boxes.filter(b => !b.checked).map(b => "- " + b.dataset.label);
    $("scoreBtn").href = waLink(
      `Assalamualaikum, saya buat semakan kesihatan kewangan di laman anda. Skor saya ${done}/${boxes.length}.` +
      (missing.length ? `\nPerkara yang saya belum ada:\n${missing.join("\n")}\nBoleh bantu saya?` : " Boleh semak pelan saya?")
    );
  };
  boxes.forEach(b => b.addEventListener("change", update));
  update();
}

/* ---------- Kalkulator persaraan ---------- */
function futureValue({ current, monthly, rate, years }) {
  const r = rate / 100 / 12;
  const n = Math.max(0, Math.round(years * 12));
  if (r === 0) return current + monthly * n;
  const growth = Math.pow(1 + r, n);
  return current * growth + monthly * ((growth - 1) / r);
}
// Bayaran bulanan selama 20 tahun (andaian pulangan 4% semasa bersara)
function monthlyIncome(total, years = 20, rate = 4) {
  const r = rate / 100 / 12;
  const n = years * 12;
  return total * r / (1 - Math.pow(1 + r, -n));
}

if ($("heroValue")) {
  $("heroValue").textContent = rm(futureValue({ current: 0, monthly: 300, rate: 6, years: 30 }));
}

if ($("retireCalc")) {
  const calcRetire = () => {
    const age = +$("age").value;
    let retire = +$("retire").value;
    if (retire <= age) { retire = age + 1; $("retire").value = retire; }

    const current = Math.max(0, +$("current").value || 0);
    const monthly = +$("monthly").value;
    const rate = +$("rate").value;
    const years = retire - age;

    const total = futureValue({ current, monthly, rate, years });
    const invested = current + monthly * years * 12;
    const growth = Math.max(0, total - invested);

    $("oAge").textContent = age;
    $("oRetire").textContent = retire;
    $("oMonthly").textContent = "RM" + monthly.toLocaleString("en-MY");
    $("oRate").textContent = rate + "%";
    $("rAge").textContent = retire;
    $("rTotal").textContent = rm(total);
    $("rIn").textContent = rm(invested);
    $("rGrow").textContent = rm(growth);
    $("barIn").style.width = (total > 0 ? (invested / total) * 100 : 100) + "%";
    $("rMonthlyIncome").textContent = rm(monthlyIncome(total));
    $("retireBtn").href = waLink(
      `Assalamualaikum, saya guna kalkulator persaraan di laman anda. Umur saya ${age}, nak bersara pada umur ${retire}, ` +
      `dan boleh labur RM${monthly} sebulan. Boleh bincang pelan yang sesuai?`
    );
  };
  $("retireCalc").addEventListener("input", calcRetire);
  calcRetire();
}

/* ---------- Kalkulator keperluan perlindungan ---------- */
if ($("protectCalc")) {
  const num = id => Math.max(0, +$(id).value || 0);
  const calcProtect = () => {
    const income = num("pIncome");
    const years = +$("pYears").value;
    const debt = num("pDebt");
    const other = num("pOther");
    const existing = num("pExisting");

    const incomeNeed = income * 12 * years;
    const need = incomeNeed + debt + other;
    const gap = Math.max(0, need - existing);

    $("oYears").textContent = years + " tahun";
    $("pIncomeNeed").textContent = rm(incomeNeed);
    $("pDebtOut").textContent = rm(debt);
    $("pOtherOut").textContent = rm(other);
    $("pNeed").textContent = rm(need);
    $("pExistingOut").textContent = "− " + rm(existing);
    $("pGap").textContent = rm(gap);
    $("pGapNote").textContent = gap === 0
      ? "Tahniah! Perlindungan sedia ada anda nampak mencukupi. Jom semak sama ada ia masih sesuai dengan keperluan semasa."
      : "Dengan backup plan ini, keluarga anda boleh meneruskan kehidupan dan matlamat seperti yang dirancang.";
    $("protectBtn").href = waLink(
      `Assalamualaikum, saya guna kalkulator backup plan di laman anda. Cadangan tambahan perlindungan saya ${rm(gap)}. ` +
      `Boleh bantu saya bina pelan takaful yang sesuai?`
    );
  };
  $("protectCalc").addEventListener("input", calcProtect);
  calcProtect();
}

/* ---------- Borang hubungi -> WhatsApp ---------- */
const contactForm = $("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("cName").value.trim();
    const age = $("cAge").value.trim();
    const goal = $("cGoal").value;
    const msg =
      `Assalamualaikum, nama saya ${name}` + (age ? `, umur ${age}` : "") +
      `. Saya berminat tentang: ${goal}. Boleh saya dapatkan konsultasi percuma?`;
    window.open(waLink(msg), "_blank", "noopener");
  });
}

/* ---------- Borang kerjaya -> WhatsApp ---------- */
const careerForm = $("careerForm");
if (careerForm) {
  careerForm.addEventListener("submit", e => {
    e.preventDefault();
    const v = id => $(id).value.trim();
    const msg =
      `Assalamualaikum, saya berminat dengan peluang kerjaya sebagai perunding kewangan.\n` +
      `Nama: ${v("kName")}\n` +
      (v("kAge") ? `Umur: ${v("kAge")}\n` : "") +
      (v("kJob") ? `Pekerjaan sekarang: ${v("kJob")}\n` : "") +
      (v("kArea") ? `Lokasi: ${v("kArea")}\n` : "") +
      `Minat: ${v("kMode")}\n` +
      `Boleh saya sertai sesi taklimat kerjaya?`;
    window.open(waLink(msg), "_blank", "noopener");
  });
}
