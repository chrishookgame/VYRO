import { VYRO_LIVE_VISUAL_LAYER } from "@/components/live/visualcoordination/GlobalVisualLayerPolicy";

interface MVPCelebrationProps {
  creatorName: string;
  score?: number;
  visible: boolean;
}

export function MVPCelebration({
  creatorName,
  score,
  visible,
}: MVPCelebrationProps) {
  if(!visible){
    return null;
  }

  return (
    <div
      style={{
        position:"absolute",
        left:"50%",
        bottom:"150px",
        transform:"translateX(-50%)",
        zIndex:VYRO_LIVE_VISUAL_LAYER.supportingMoment,
        pointerEvents:"none",
        textAlign:"center",
      }}
    >
      <div
        style={{
          padding:"18px 28px",
          borderRadius:"24px",
          background:
            "rgba(8,10,20,0.94)",
          border:
            "1px solid rgba(255,255,255,0.2)",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            fontSize:"12px",
            fontWeight:900,
            letterSpacing:"0.2em",
          }}
        >
          LIVE MVP
        </div>

        <div
          style={{
            marginTop:"6px",
            fontSize:"30px",
            fontWeight:950,
          }}
        >
          {creatorName}
        </div>

        {typeof score === "number" ? (
          <div
            style={{
              marginTop:"4px",
              opacity:0.72,
            }}
          >
            Score {score}
          </div>
        ) : null}
      </div>
    </div>
  );
}
