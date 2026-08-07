import type {
  CompetitiveVisualEvent,
} from "../types/CompetitiveVisualTypes";

interface CompetitiveOverlayProps {
  event: CompetitiveVisualEvent | null;
}

export function CompetitiveOverlay({
  event,
}: CompetitiveOverlayProps) {
  if(!event){
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position:"absolute",
        inset:0,
        pointerEvents:"none",
        display:"flex",
        alignItems:"flex-start",
        justifyContent:"center",
        padding:"24px",
        zIndex:40,
      }}
    >
      <div
        style={{
          maxWidth:"720px",
          width:"100%",
          borderRadius:"24px",
          padding:"18px 24px",
          background:
            "rgba(8, 10, 20, 0.88)",
          border:
            "1px solid rgba(255,255,255,0.18)",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.45)",
          backdropFilter:
            "blur(18px)",
          textAlign:"center",
        }}
      >
        <div
          style={{
            fontSize:"12px",
            fontWeight:800,
            letterSpacing:"0.18em",
            textTransform:"uppercase",
            opacity:0.72,
          }}
        >
          VYRO LIVE
        </div>

        <div
          style={{
            marginTop:"8px",
            fontSize:"24px",
            fontWeight:900,
            lineHeight:1.15,
          }}
        >
          {event.message}
        </div>
      </div>
    </div>
  );
}
