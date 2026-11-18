import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { rm } from "../kira";

// Bar dijana daripada angka pengiraan, jadi ia programatik (tidak boleh diedit
// terus dalam Studio). Ubah angka melalui props komposisi.
type Props = {
  readonly label: string;
  readonly nilai: number;
  readonly dilabur: number;
  readonly tinggiMaks: number;
  readonly nisbah: number;
  readonly warna: string;
  readonly mulaSaat: number;
};

export const Bar = ({
  label,
  nilai,
  dilabur,
  tinggiMaks,
  nisbah,
  warna,
  mulaSaat,
}: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kemajuan = interpolate(
    frame,
    [mulaSaat * fps, (mulaSaat + 5) * fps],
    [0, 1],
    {
      easing: Easing.bezier(0.33, 1, 0.68, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: 380,
        height: tinggiMaks + 260,
        fontFamily: "Plus Jakarta Sans, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 60,
          fontWeight: 800,
          color: "#fbfaf6",
          marginBottom: 20,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {rm(nilai * kemajuan)}
      </div>
      <div
        style={{
          width: 260,
          height: Math.max(8, tinggiMaks * nisbah * kemajuan),
          backgroundColor: warna,
          borderRadius: "24px 24px 0 0",
        }}
      />
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: "#fbfaf6",
          marginTop: 28,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 34, fontWeight: 500, color: "#e3f1ec", marginTop: 8 }}>
        Dilabur {rm(dilabur)}
      </div>
    </div>
  );
};
