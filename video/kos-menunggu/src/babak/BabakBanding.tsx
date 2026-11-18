import {
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { nilaiMasaDepan } from "../kira";
import { Bar } from "./Bar";

type Props = {
  readonly bulanan: number;
  readonly pulangan: number;
  readonly umurAwal: number;
  readonly umurLewat: number;
  readonly umurBersara: number;
};

const BabakBandingInner = ({
  bulanan,
  pulangan,
  umurAwal,
  umurLewat,
  umurBersara,
}: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tahunAwal = umurBersara - umurAwal;
  const tahunLewat = umurBersara - umurLewat;
  const nilaiAwal = nilaiMasaDepan(bulanan, pulangan, tahunAwal);
  const nilaiLewat = nilaiMasaDepan(bulanan, pulangan, tahunLewat);
  const peratus = Math.round((nilaiLewat / nilaiAwal) * 100);

  return (
    <>
      <Interactive.Div
        name="Tajuk perbandingan"
        style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 56,
          fontWeight: 800,
          color: "#fbfaf6",
          textAlign: "center",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {`RM${bulanan} sebulan hingga umur ${umurBersara}`}
      </Interactive.Div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 60,
          marginTop: 40,
        }}
      >
        <Bar
          label={`Mula ${umurAwal}`}
          nilai={nilaiAwal}
          dilabur={bulanan * 12 * tahunAwal}
          tinggiMaks={720}
          nisbah={1}
          warna="#d9a441"
          mulaSaat={1}
        />
        <Bar
          label={`Mula ${umurLewat}`}
          nilai={nilaiLewat}
          dilabur={bulanan * 12 * tahunLewat}
          tinggiMaks={720}
          nisbah={nilaiLewat / nilaiAwal}
          warna="#23806b"
          mulaSaat={1}
        />
      </div>
      <Interactive.Div
        name="Rumusan"
        style={{
          marginTop: 48,
          paddingTop: 24,
          paddingBottom: 24,
          paddingLeft: 40,
          paddingRight: 40,
          borderRadius: 24,
          backgroundColor: "#fbfaf6",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 50,
          fontWeight: 800,
          color: "#0f3d34",
          textAlign: "center",
          opacity: interpolate(frame, [7 * fps, 7.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [7 * fps, 7.6 * fps], [0.9, 1], {
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {`Mula ${umurLewat - umurAwal} tahun lewat ≈ ${peratus}% sahaja`}
      </Interactive.Div>
      <Interactive.Div
        name="Nota ilustrasi"
        style={{
          marginTop: 32,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 30,
          fontWeight: 500,
          color: "#e3f1ec",
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        {`Ilustrasi: andaian ${pulangan}% setahun, pengkompaunan bulanan, sebelum caj, yuran & inflasi. Bukan jaminan.`}
      </Interactive.Div>
    </>
  );
};

export const BabakBanding = Interactive.create({
  Component: BabakBandingInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
    bulanan: {
      type: "number",
      default: 300,
      min: 50,
      step: 50,
      description: "Pelaburan bulanan (RM)",
      keyframable: false,
      hiddenFromList: false,
    },
    pulangan: {
      type: "number",
      default: 6,
      min: 0,
      max: 12,
      step: 0.5,
      description: "Andaian pulangan setahun (%)",
      keyframable: false,
      hiddenFromList: false,
    },
    umurAwal: {
      type: "number",
      default: 30,
      integer: true,
      description: "Umur mula (awal)",
      keyframable: false,
      hiddenFromList: false,
    },
    umurLewat: {
      type: "number",
      default: 40,
      integer: true,
      description: "Umur mula (lewat)",
      keyframable: false,
      hiddenFromList: false,
    },
    umurBersara: {
      type: "number",
      default: 60,
      integer: true,
      description: "Umur bersara",
      keyframable: false,
      hiddenFromList: false,
    },
  },
});
