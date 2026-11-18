// Formula sama seperti kalkulator di laman web (script.js): pengkompaunan bulanan,
// sebelum caj jualan, yuran pengurusan dan inflasi. Ilustrasi sahaja.
export const nilaiMasaDepan = (
  bulanan: number,
  pulanganTahunan: number,
  tahun: number,
): number => {
  const r = pulanganTahunan / 100 / 12;
  const n = tahun * 12;
  if (r === 0) return bulanan * n;
  return bulanan * ((Math.pow(1 + r, n) - 1) / r);
};

export const rm = (nilai: number): string =>
  "RM" + Math.round(nilai).toLocaleString("en-MY");
