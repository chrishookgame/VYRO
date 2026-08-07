interface CompetitiveBannerProps {
  title: string;
  subtitle?: string;
  visible: boolean;
}

export function CompetitiveBanner({
  title,
  subtitle,
  visible,
}: CompetitiveBannerProps) {
  if(!visible){
    return null;
  }

  return (
    <div
      style={{
        display:"flex",
        justifyContent:"center",
        pointerEvents:"none",
      }}
    >
      <div
        style={{
          borderRadius:"999px",
          padding:"10px 18px",
          background:
            "rgba(15, 18, 30, 0.9)",
          border:
            "1px solid rgba(255,255,255,0.16)",
          textAlign:"center",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            fontWeight:900,
            fontSize:"14px",
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            style={{
              marginTop:"2px",
              fontSize:"12px",
              opacity:0.7,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}
