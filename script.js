/* =====================================================
   TETAPAN — tukar maklumat di bawah kepada maklumat anda
   ===================================================== */
const CONFIG = {
  brand: "Jannah Financial",          // Nama bisnes
  name: "Nurul Jannah",               // Nama anda
  fimm: "XXXXXXXX",                   // No. pendaftaran FIMM
  whatsapp: "60123456789",            // No. WhatsApp: kod negara 60, tanpa "+", tanpa sengkang
  defaultMessage: "Assalamualaikum, saya berminat nak tahu tentang perancangan persaraan."
};

/* ===================================================== */

// Masukkan maklumat CONFIG ke dalam halaman
document.querySelectorAll("[data-config]").forEach(el => {
  const key = el.dataset.config;
  if (CONFIG[key]) el.textContent = CONFIG[key];
});
document.getElementById("year").textContent = new Date().getFullYear();

const waLink = msg => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

document.querySelectorAll("[data-wa]").forEach(el => {
  el.href = waLink(CONFIG.defaultMessage);
  el.target = "_blank";
  el.rel = "noopener";
});

// Format RM
const rm = n => "RM " + Math.round(n).toLocaleString("en-MY");

// Nilai masa depan dengan pengkompaunan bulanan
function futureValue({ current, monthly, rate, years }) {
  const r = rate / 100 / 12;
  const n = Math.max(0, Math.round(years * 12));
  if (r === 0) return current + monthly * n;
  const growth = Math.pow(1 + r, n);
  return current * growth + monthly * ((growth - 1) / r);
}

// Anggaran bayaran bulanan selama 20 tahun (anuiti, pulangan 4% semasa bersara)
function monthlyIncome(total, years = 20, rate = 4) {
  const r = rate / 100 / 12;
  const n = years * 12;
  return total * r / (1 - Math.pow(1 + r, -n));
}

// Kad hero
document.getElementById("heroValue").textContent =
  rm(futureValue({ current: 0, monthly: 300, rate: 6, years: 30 }));

// Kalkulator
const $ = id => document.getElementById(id);
const inputs = ["age", "retire", "current", "monthly", "rate"].map($);

function calculate() {
  let age = +$("age").value;
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

  document.querySelectorAll("[data-wa-calc]").forEach(el => {
    el.href = waLink(
      `Assalamualaikum, saya guna kalkulator di laman anda. Umur saya ${age}, nak bersara pada umur ${retire}, ` +
      `dan boleh labur RM${monthly} sebulan. Boleh bincang pelan yang sesuai?`
    );
  });
}
inputs.forEach(el => el.addEventListener("input", calculate));
calculate();

// Borang hubungi -> WhatsApp
$("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("cName").value.trim();
  const age = $("cAge").value.trim();
  const goal = $("cGoal").value;
  const msg =
    `Assalamualaikum, nama saya ${name}` + (age ? `, umur ${age}` : "") +
    `. Saya berminat tentang: ${goal}. Boleh saya dapatkan konsultasi percuma?`;
  window.open(waLink(msg), "_blank", "noopener");
});
