import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BabakMesejInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <Interactive.Div
        name="Mesej utama"
        style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 150,
          fontWeight: 800,
          color: "#d9a441",
          textAlign: "center",
          lineHeight: 1.05,
          scale: interpolate(frame, [0, 0.6 * fps], [0.8, 1], {
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Masa &gt; Jumlah
      </Interactive.Div>
      <Interactive.Div
        name="Mesej sokongan"
        style={{
          marginTop: 56,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 60,
          fontWeight: 700,
          color: "#fbfaf6",
          textAlign: "center",
          lineHeight: 1.25,
          opacity: interpolate(frame, [1 * fps, 1.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Bukan soal berapa banyak. Soal bila anda mula.
      </Interactive.Div>
      <Interactive.Div
        name="Mesej penutup"
        style={{
          marginTop: 48,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 52,
          fontWeight: 500,
          color: "#e3f1ec",
          textAlign: "center",
          opacity: interpolate(frame, [3 * fps, 3.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Jumlah kecil pun boleh.
      </Interactive.Div>
    </>
  );
};

export const BabakMesej = Interactive.create({
  Component: BabakMesejInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
