import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {
  readonly whatsapp: string;
  readonly namaFimm: string;
};

const BabakCTAInner = ({ whatsapp, namaFimm }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <Interactive.Div
        name="Soalan CTA"
        style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 76,
          fontWeight: 800,
          color: "#fbfaf6",
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Nak kira untuk umur anda?
      </Interactive.Div>
      <Interactive.Div
        name="Butang WhatsApp"
        style={{
          marginTop: 56,
          paddingTop: 32,
          paddingBottom: 32,
          paddingLeft: 64,
          paddingRight: 64,
          borderRadius: 999,
          backgroundColor: "#d9a441",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 58,
          fontWeight: 800,
          color: "#0f3d34",
          whiteSpace: "nowrap",
          textAlign: "center",
          scale: interpolate(frame, [0, 0.5 * fps], [0.85, 1], {
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {`WhatsApp ${whatsapp}`}
      </Interactive.Div>
      <Interactive.Div
        name="Tawaran"
        style={{
          marginTop: 36,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 46,
          fontWeight: 700,
          color: "#e3f1ec",
          textAlign: "center",
        }}
      >
        Konsultasi percuma · Tiada paksaan
      </Interactive.Div>
      <Interactive.Div
        name="Nama dan FIMM"
        style={{
          marginTop: 24,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 36,
          fontWeight: 500,
          color: "#e3f1ec",
          textAlign: "center",
        }}
      >
        {namaFimm}
      </Interactive.Div>
      <Interactive.Div
        name="Penafian"
        style={{
          marginTop: 64,
          paddingTop: 28,
          paddingBottom: 28,
          paddingLeft: 32,
          paddingRight: 32,
          borderRadius: 20,
          backgroundColor: "#134a3f",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 30,
          fontWeight: 500,
          color: "#e3f1ec",
          lineHeight: 1.4,
          textAlign: "left",
        }}
      >
        Ilustrasi sahaja, bukan unjuran mana-mana dana. Pelaburan melibatkan
        risiko termasuk kehilangan modal. Harga unit boleh naik atau turun.
        Prestasi lalu tidak menjamin prestasi masa hadapan. Baca Prospektus /
        Dokumen Penzahiran dan Lembaran Penonjolan Produk sebelum melabur.
        Produk ditawarkan melalui Manulife Investment Management (M) Berhad.
      </Interactive.Div>
    </>
  );
};

export const BabakCTA = Interactive.create({
  Component: BabakCTAInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
    whatsapp: {
      type: "string",
      default: "012-394 7764",
      description: "Nombor WhatsApp",
    },
    namaFimm: {
      type: "string",
      default: "Nurul Jannah Mahmud · FIMM F02024801",
      description: "Nama dan nombor FIMM",
    },
  },
});
