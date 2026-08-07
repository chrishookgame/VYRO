interface WinStreakOverlayProps {
  creatorName: string;
  streak: number;
  visible: boolean;
}

export function WinStreakOverlay({
  creatorName,
  streak,
  visible,
}: WinStreakOverlayProps) {
  if(!visible || streak < 3){
    return null;
  }

  return (
    <div
      style={{
        position:"absolute",
        right:"24px",
        top:"110px",
        zIndex:35,
        pointerEvents:"none",
      }}
    >
      <div
        style={{
          padding:"14px 18px",
          borderRadius:"18px",
          background:
            "rgba(12, 12, 20, 0.9)",
          border:
            "1px solid rgba(255,255,255,0.16)",
          textAlign:"right",
        }}
      >
        <div
          style={{
            fontSize:"12px",
            fontWeight:800,
            opacity:0.7,
          }}
        >
          WIN STREAK
        </div>

        <div
          style={{
            marginTop:"4px",
            fontSize:"26px",
            fontWeight:950,
          }}
        >
          {streak} WINS
        </div>

        <div
          style={{
            fontSize:"13px",
            opacity:0.72,
          }}
        >
          {creatorName}
        </div>
      </div>
    </div>
  );
}
