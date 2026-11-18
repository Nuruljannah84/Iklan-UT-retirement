import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {
  readonly hook: string;
  readonly hookSorotan: string;
};

const BabakHookInner = ({ hook, hookSorotan }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <Interactive.Div
        name="Garis emas"
        style={{
          width: 140,
          height: 12,
          borderRadius: 6,
          backgroundColor: "#d9a441",
          marginBottom: 48,
          scale: interpolate(frame, [0, 0.4 * fps], [0, 1], {
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Interactive.Div
        name="Hook"
        style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 104,
          fontWeight: 800,
          lineHeight: 1.1,
          color: "#fbfaf6",
          textAlign: "center",
          opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0, 0.6 * fps], ["0px 60px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {hook}
      </Interactive.Div>
      <Interactive.Div
        name="Hook sorotan"
        style={{
          marginTop: 40,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 76,
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#d9a441",
          textAlign: "center",
          opacity: interpolate(frame, [0.6 * fps, 1 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0.6 * fps, 1.2 * fps], ["0px 40px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {hookSorotan}
      </Interactive.Div>
    </>
  );
};

export const BabakHook = Interactive.create({
  Component: BabakHookInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
    hook: { type: "string", default: "", description: "Hook (baris utama)" },
    hookSorotan: {
      type: "string",
      default: "",
      description: "Hook (baris sorotan emas)",
    },
  },
});
