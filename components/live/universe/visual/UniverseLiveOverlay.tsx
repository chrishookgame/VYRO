"use client";

import {
  createUniverseEngineState,
} from "../UniverseEngine";

interface UniverseLiveOverlayProps {
  state:ReturnType<
    typeof createUniverseEngineState
  >;
}

export default function UniverseLiveOverlay({
  state,
}:UniverseLiveOverlayProps){
  const {
    spectacle,
    universe,
  }=state;

  const visible=
    universe.worldEvent.active ||
    spectacle.celebration.active ||
    universe.momentum.momentum >= 25;

  if(!visible){
    return null;
  }

  return (
    <aside
      data-vyro-universe="true"
      data-universe-level={
        universe.universeLevel
      }
      data-arena-stage={
        universe.arena.stage
      }
      data-world-event={
        universe.worldEvent.event
      }
      style={{
        position:"fixed",
        top:"84px",
        right:"20px",
        zIndex:74,
        pointerEvents:"none",
        width:"min(320px, calc(100vw - 40px))",
      }}
    >
      <div
        style={{
          borderRadius:"24px",
          padding:"14px 16px",
          background:"rgba(5,8,18,0.88)",
          border:"1px solid rgba(255,255,255,0.14)",
          boxShadow:"0 20px 70px rgba(0,0,0,0.48)",
          backdropFilter:"blur(18px)",
          transform:
            `scale(${spectacle.atmosphere.pulse})`,
          transition:
            "transform 300ms ease, opacity 300ms ease",
        }}
      >
        <div
          style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between",
            gap:"12px",
          }}
        >
          <span
            style={{
              fontSize:"10px",
              fontWeight:900,
              letterSpacing:"0.2em",
              opacity:0.65,
            }}
          >
            VYRO UNIVERSE
          </span>

          <span
            style={{
              fontSize:"11px",
              fontWeight:950,
            }}
          >
            {universe.universeLevel}
          </span>
        </div>

        <div
          style={{
            marginTop:"12px",
            display:"grid",
            gridTemplateColumns:"1fr 1fr",
            gap:"8px",
          }}
        >
          <div>
            <div
              style={{
                fontSize:"10px",
                opacity:0.55,
              }}
            >
              Momentum
            </div>

            <div
              style={{
                marginTop:"2px",
                fontSize:"17px",
                fontWeight:950,
              }}
            >
              {universe.momentum.momentum}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize:"10px",
                opacity:0.55,
              }}
            >
              Arena
            </div>

            <div
              style={{
                marginTop:"2px",
                fontSize:"13px",
                fontWeight:950,
              }}
            >
              {universe.arena.stage}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize:"10px",
                opacity:0.55,
              }}
            >
              Crowd
            </div>

            <div
              style={{
                marginTop:"2px",
                fontSize:"13px",
                fontWeight:950,
              }}
            >
              {spectacle.crowd.reaction}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize:"10px",
                opacity:0.55,
              }}
            >
              Legacy
            </div>

            <div
              style={{
                marginTop:"2px",
                fontSize:"13px",
                fontWeight:950,
              }}
            >
              {universe.legacy.tier}
            </div>
          </div>
        </div>

        {universe.worldEvent.active ? (
          <div
            style={{
              marginTop:"12px",
              borderRadius:"999px",
              padding:"7px 10px",
              textAlign:"center",
              fontSize:"11px",
              fontWeight:950,
              letterSpacing:"0.08em",
              background:"rgba(255,255,255,0.08)",
            }}
          >
            {universe.worldEvent.event}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
