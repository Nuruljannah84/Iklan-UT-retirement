import { Track, useVideoConfig } from "remotion";
import { BabakBanding } from "./babak/BabakBanding";
import { BabakCTA } from "./babak/BabakCTA";
import { BabakHook } from "./babak/BabakHook";
import { BabakMesej } from "./babak/BabakMesej";

// Skrip A "Kos Menunggu" (25s). Hanya hook berubah antara variasi A/B;
// babak lain sama supaya ujian mengukur kesan hook sahaja.
export type KosMenungguProps = {
  readonly hook: string;
  readonly hookSorotan: string;
};

export const KosMenunggu = ({ hook, hookSorotan }: KosMenungguProps) => {
  const { fps } = useVideoConfig();

  return (
    <Track name="Babak">
      <BabakHook
        name="Hook"
        durationInFrames={3 * fps}
        hook={hook}
        hookSorotan={hookSorotan}
        style={{
          backgroundColor: "#0f3d34",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 90,
          paddingRight: 90,
        }}
      />
      <BabakBanding
        name="Perbandingan"
        from={3 * fps}
        durationInFrames={12 * fps}
        bulanan={300}
        pulangan={6}
        umurAwal={30}
        umurLewat={40}
        umurBersara={60}
        style={{
          backgroundColor: "#0f3d34",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 90,
          paddingRight: 90,
        }}
      />
      <BabakMesej
        name="Mesej"
        from={15 * fps}
        durationInFrames={6 * fps}
        style={{
          backgroundColor: "#0f3d34",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 90,
          paddingRight: 90,
        }}
      />
      <BabakCTA
        name="CTA dan penafian"
        from={21 * fps}
        durationInFrames={4 * fps}
        whatsapp="012-394 7764"
        namaFimm="Nurul Jannah Mahmud · FIMM F02024801"
        style={{
          backgroundColor: "#0f3d34",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 90,
          paddingRight: 90,
        }}
      />
    </Track>
  );
};
