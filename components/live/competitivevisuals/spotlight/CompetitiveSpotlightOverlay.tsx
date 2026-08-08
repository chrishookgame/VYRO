interface CompetitiveSpotlightOverlayProps {
  creatorName: string;
  rank: number;
  competitivePower: number;
  wins?: number;
  visible: boolean;
}

export function CompetitiveSpotlightOverlay({
  creatorName,
  rank,
  competitivePower,
  wins,
  visible,
}: CompetitiveSpotlightOverlayProps) {
  if(!visible){
    return null;
  }

  return (
    <div
      style={{
        position:"absolute",
        left:"24px",
        bottom:"100px",
        zIndex:35,
        pointerEvents:"none",
      }}
    >
      <div
        style={{
          minWidth:"260px",
          padding:"16px 18px",
          borderRadius:"20px",
          background:
            "rgba(9, 11, 22, 0.92)",
          border:
            "1px solid rgba(255,255,255,0.16)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            fontSize:"11px",
            fontWeight:900,
            letterSpacing:"0.16em",
            opacity:0.65,
          }}
        >
          {typeof wins === "number"
            ? "VYRO WIN LEADER"
            : "VYRO SPOTLIGHT"}
        </div>

        <div
          style={{
            marginTop:"6px",
            fontSize:"21px",
            fontWeight:900,
          }}
        >
          {creatorName}
        </div>

        <div
          style={{
            marginTop:"6px",
            display:"flex",
            gap:"14px",
            fontSize:"13px",
            flexWrap:"wrap",
          }}
        >
          <span>
            Rank #{rank}
          </span>

          {typeof wins === "number" ? (
            <span>
              Wins {wins}
            </span>
          ) : null}

          <span>
            Power {competitivePower}
          </span>
        </div>
      </div>
    </div>
  );
}
