import "./fon";
import { Composition, Folder } from "remotion";
import { BabakBanding } from "./babak/BabakBanding";
import { BabakCTA } from "./babak/BabakCTA";
import { KosMenunggu } from "./KosMenunggu";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Iklan-Kos-Menunggu">
        <Composition
          id="KosMenunggu-H1"
          component={KosMenunggu}
          durationInFrames={750}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            hook: "Mula 10 tahun lambat,",
            hookSorotan: "simpanan persaraan boleh tinggal separuh.",
          }}
        />
        <Composition
          id="KosMenunggu-H2"
          component={KosMenunggu}
          durationInFrames={750}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            hook: "RM300 sebulan.",
            hookSorotan: "Mula umur 30 atau 40, bezanya besar.",
          }}
        />
        <Composition
          id="KosMenunggu-H3"
          component={KosMenunggu}
          durationInFrames={750}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            hook: "Gaji naik setiap tahun.",
            hookSorotan: "Simpanan persaraan anda naik sekali tak?",
          }}
        />
      </Folder>
      <Folder name="Babak">
        <Composition
          id="Babak-Perbandingan"
          component={BabakBanding}
          durationInFrames={360}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            bulanan: 300,
            pulangan: 6,
            umurAwal: 30,
            umurLewat: 40,
            umurBersara: 60,
            style: {
              backgroundColor: "#0f3d34",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 90,
              paddingRight: 90,
            },
          }}
        />
        <Composition
          id="Babak-CTA"
          component={BabakCTA}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            whatsapp: "012-394 7764",
            namaFimm: "Nurul Jannah Mahmud · FIMM F02024801",
            style: {
              backgroundColor: "#0f3d34",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 90,
              paddingRight: 90,
            },
          }}
        />
      </Folder>
    </>
  );
};
