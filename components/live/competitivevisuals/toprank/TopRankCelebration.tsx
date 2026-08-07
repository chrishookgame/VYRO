interface TopRankCelebrationProps {
  creatorName: string;
  rank: number;
  visible: boolean;
}

export function TopRankCelebration({
  creatorName,
  rank,
  visible,
}: TopRankCelebrationProps) {
  if(
    !visible ||
    rank < 1 ||
    rank > 10
  ){
    return null;
  }

  return (
    <div
      style={{
        position:"absolute",
        top:"26%",
        left:"50%",
        transform:"translateX(-50%)",
        zIndex:50,
        pointerEvents:"none",
      }}
    >
      <div
        style={{
          padding:"20px 30px",
          borderRadius:"24px",
          background:
            "rgba(8,10,20,0.94)",
          border:
            "1px solid rgba(255,255,255,0.2)",
          textAlign:"center",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            fontSize:"13px",
            fontWeight:900,
            letterSpacing:"0.18em",
          }}
        >
          GLOBAL RANK
        </div>

        <div
          style={{
            marginTop:"6px",
            fontSize:"44px",
            fontWeight:950,
          }}
        >
          #{rank}
        </div>

        <div
          style={{
            fontSize:"18px",
            fontWeight:800,
          }}
        >
          {creatorName}
        </div>
      </div>
    </div>
  );
}
