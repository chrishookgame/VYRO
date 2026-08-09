import { VYRO_LIVE_VISUAL_LAYER } from "@/components/live/visualcoordination/GlobalVisualLayerPolicy";

interface ChampionCelebrationProps {
  creatorName: string;
  championships: number;
  visible: boolean;
}

export function ChampionCelebration({
  creatorName,
  championships,
  visible,
}: ChampionCelebrationProps) {
  if(!visible){
    return null;
  }

  return (
    <div
      style={{
        position:"absolute",
        inset:0,
        zIndex:VYRO_LIVE_VISUAL_LAYER.championMoment,
        pointerEvents:"none",
        display:"grid",
        placeItems:"center",
        background:
          "radial-gradient(circle at center, rgba(255,215,0,0.18), rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.55))",
      }}
    >
      <div
        style={{
          textAlign:"center",
          padding:"32px",
        }}
      >
        <div
          style={{
            fontSize:"60px",
            lineHeight:1,
          }}
        >
          👑
        </div>

        <div
          style={{
            marginTop:"14px",
            fontSize:"14px",
            fontWeight:900,
            letterSpacing:"0.22em",
          }}
        >
          VYRO CHAMPION
        </div>

        <div
          style={{
            marginTop:"8px",
            fontSize:"42px",
            fontWeight:950,
            lineHeight:1,
          }}
        >
          {creatorName}
        </div>

        <div
          style={{
            marginTop:"12px",
            fontSize:"16px",
            opacity:0.8,
          }}
        >
          {championships} Championship
          {championships === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
}
