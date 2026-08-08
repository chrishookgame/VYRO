"use client";

import type {
  createUniverseEngineState,
} from "@/components/live/universe/UniverseEngine";

interface LiveOrchestratorOverlayProps {
  state:ReturnType<
    typeof createUniverseEngineState
  >;
}

export default function LiveOrchestratorOverlay({
  state,
}:LiveOrchestratorOverlayProps){
  const {
    orchestrator,
  }=state;

  const visible=
    orchestrator.runtimePriority >= 45 ||
    orchestrator.worldMoment ||
    orchestrator.cinematic;

  if(!visible){
    return null;
  }

  const worldMode=
    orchestrator.worldMoment ||
    orchestrator.mode === "WORLD";

  const cinematicMode=
    orchestrator.cinematic ||
    orchestrator.mode === "EPIC";

  const glowOpacity=
    Math.min(
      0.42,
      orchestrator.intensity / 240,
    );

  return (
    <>
      <div
        data-vyro-orchestrator-runtime="true"
        data-mode={
          orchestrator.mode
        }
        data-channel={
          orchestrator
            .overlays
            .primary
        }
        data-priority={
          orchestrator.runtimePriority
        }
        data-transition={
          orchestrator
            .transition
            .transition
        }
        data-performance={
          orchestrator
            .performance
            .profile
        }
        style={{
          position:"fixed",
          inset:0,
          zIndex:52,
          pointerEvents:"none",
          overflow:"hidden",
        }}
      >
        <div
          style={{
            position:"absolute",
            inset:0,
            opacity:
              worldMode
                ? 0.32
                : cinematicMode
                  ? 0.2
                  : glowOpacity,
            background:
              worldMode
                ? "radial-gradient(circle at 50% 45%, rgba(255,214,92,0.22), rgba(99,47,255,0.12) 35%, transparent 72%)"
                : cinematicMode
                  ? "radial-gradient(circle at 50% 45%, rgba(52,211,153,0.16), rgba(34,211,238,0.1) 38%, transparent 72%)"
                  : "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.12), transparent 68%)",
            transform:
              `scale(${orchestrator.transition.scale})`,
            filter:
              `blur(${Math.min(
                orchestrator.transition.blurPx,
                4,
              )}px)`,
            transition:
              `all ${orchestrator.transition.durationMs}ms ease`,
          }}
        />

        {orchestrator.worldMoment ? (
          <div
            style={{
              position:"absolute",
              inset:"8px",
              borderRadius:"28px",
              border:
                "1px solid rgba(255,220,120,0.28)",
              boxShadow:
                "inset 0 0 80px rgba(255,205,80,0.08), 0 0 60px rgba(255,205,80,0.08)",
            }}
          />
        ) : null}

        {orchestrator.cinematic ? (
          <div
            style={{
              position:"absolute",
              left:0,
              right:0,
              top:0,
              height:"3px",
              opacity:0.8,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
              transform:
                `scaleX(${Math.max(
                  0.35,
                  orchestrator.camera.motion,
                )})`,
              transition:
                `transform ${orchestrator.transition.durationMs}ms ease`,
            }}
          />
        ) : null}
      </div>

      <aside
        data-vyro-orchestrator-status="true"
        style={{
          position:"fixed",
          left:"20px",
          bottom:"20px",
          zIndex:76,
          pointerEvents:"none",
          width:
            "min(300px, calc(100vw - 40px))",
        }}
      >
        <div
          style={{
            borderRadius:"20px",
            padding:"11px 13px",
            background:"rgba(5,8,18,0.82)",
            border:"1px solid rgba(255,255,255,0.12)",
            boxShadow:"0 18px 60px rgba(0,0,0,0.38)",
            backdropFilter:"blur(16px)",
          }}
        >
          <div
            style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              gap:"10px",
            }}
          >
            <span
              style={{
                fontSize:"9px",
                fontWeight:900,
                letterSpacing:"0.18em",
                opacity:0.55,
              }}
            >
              VYRO LIVE DIRECTOR
            </span>

            <span
              style={{
                fontSize:"10px",
                fontWeight:950,
              }}
            >
              {orchestrator.mode}
            </span>
          </div>

          <div
            style={{
              marginTop:"8px",
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              gap:"12px",
              fontSize:"11px",
            }}
          >
            <span>
              {
                orchestrator
                  .overlays
                  .primary
              }
            </span>

            <span
              style={{
                fontWeight:950,
              }}
            >
              P{orchestrator.runtimePriority}
            </span>
          </div>

          <div
            style={{
              marginTop:"8px",
              height:"3px",
              overflow:"hidden",
              borderRadius:"999px",
              background:"rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                width:
                  `${orchestrator.intensity}%`,
                height:"100%",
                borderRadius:"999px",
                background:"currentColor",
                opacity:0.8,
                transition:"width 300ms ease",
              }}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
