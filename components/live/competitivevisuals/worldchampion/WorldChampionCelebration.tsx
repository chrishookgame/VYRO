import { VYRO_LIVE_VISUAL_LAYER } from "@/components/live/visualcoordination/GlobalVisualLayerPolicy";

interface WorldChampionCelebrationProps {
  creatorName: string;
  title?: string;
  message?: string;
  visible: boolean;
}

export function WorldChampionCelebration({
  creatorName,
  title,
  message,
  visible,
}: WorldChampionCelebrationProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      data-vyro-world-champion="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: VYRO_LIVE_VISUAL_LAYER.worldChampionMoment,
        pointerEvents: "none",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        background:
          "radial-gradient(circle at center, rgba(255,215,0,0.25), rgba(92,40,0,0.12) 38%, rgba(0,0,0,0.82) 78%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "8%",
          borderRadius: "50%",
          border:
            "1px solid rgba(255,215,0,0.22)",
          boxShadow:
            "0 0 120px rgba(255,215,0,0.20)",
        }}
      />

      <div
        style={{
          position: "relative",
          textAlign: "center",
          padding: "42px",
          maxWidth: "760px",
        }}
      >
        <div
          style={{
            fontSize: "86px",
            lineHeight: 1,
            filter:
              "drop-shadow(0 0 28px rgba(255,215,0,0.55))",
          }}
        >
          👑
        </div>

        <div
          style={{
            marginTop: "18px",
            fontSize: "13px",
            fontWeight: 950,
            letterSpacing: "0.36em",
            color: "#FFE27A",
          }}
        >
          VYRO WORLD CHAMPION
        </div>

        <div
          style={{
            marginTop: "12px",
            fontSize: "52px",
            fontWeight: 950,
            lineHeight: 1,
            color: "#FFFFFF",
            textShadow:
              "0 0 40px rgba(255,215,0,0.30)",
          }}
        >
          {creatorName}
        </div>

        {title ? (
          <div
            style={{
              marginTop: "18px",
              fontSize: "20px",
              fontWeight: 900,
              color: "#FFE9A5",
            }}
          >
            {title}
          </div>
        ) : null}

        {message ? (
          <div
            style={{
              marginTop: "10px",
              fontSize: "15px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {message}
          </div>
        ) : null}
      </div>
    </div>
  );
}
