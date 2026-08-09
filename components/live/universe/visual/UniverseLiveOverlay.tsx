"use client";

import { VYRO_LIVE_VISUAL_LAYER } from "@/components/live/visualcoordination/GlobalVisualLayerPolicy";

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
    intelligence,
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
      data-ai-mode={
        intelligence.aiMode
      }
      data-prediction={
        intelligence
          .prediction
          .prediction
      }
      style={{
        position:"fixed",
        top:"84px",
        right:"20px",
        zIndex:VYRO_LIVE_VISUAL_LAYER.universeOverlay,
        pointerEvents:"none",
        width:"min(340px, calc(100vw - 40px))",
      }}
    >
      <div
        style={{
          borderRadius:"24px",
          padding:"14px 16px",
          background:"rgba(5,8,18,0.9)",
          border:"1px solid rgba(255,255,255,0.14)",
          boxShadow:"0 20px 70px rgba(0,0,0,0.48)",
          backdropFilter:"blur(18px)",
          transform:
            `scale(${spectacle.atmosphere.pulse * intelligence.optimizer.visualScale})`,
          transition:
            "transform 300ms ease, opacity 300ms ease",
        }}
      >
        <div
          style={{
            display:"flex",
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
            VYRO UNIVERSE AI
          </span>

          <span
            style={{
              fontSize:"11px",
              fontWeight:950,
            }}
          >
            {intelligence.aiMode}
          </span>
        </div>

        <div
          style={{
            marginTop:"12px",
            display:"grid",
            gridTemplateColumns:"1fr 1fr",
            gap:"9px",
          }}
        >
          <Metric
            label="Momentum"
            value={
              universe
                .momentum
                .momentum
            }
          />

          <Metric
            label="Emotion"
            value={
              intelligence
                .emotion
                .emotion
            }
          />

          <Metric
            label="Prediction"
            value={
              intelligence
                .prediction
                .prediction
            }
          />

          <Metric
            label="Probability"
            value={`${intelligence.prediction.probability}%`}
          />

          <Metric
            label="Arena"
            value={
              universe
                .arena
                .stage
            }
          />

          <Metric
            label="Creator AI"
            value={
              intelligence
                .performance
                .level
            }
          />

          <Metric
            label="Crowd"
            value={
              spectacle
                .crowd
                .reaction
            }
          />

          <Metric
            label="Legacy"
            value={
              universe
                .legacy
                .tier
            }
          />
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
            {
              universe
                .worldEvent
                .event
            }
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function Metric({
  label,
  value,
}:{
  label:string;
  value:string | number;
}){
  return (
    <div>
      <div
        style={{
          fontSize:"10px",
          opacity:0.55,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop:"2px",
          fontSize:"13px",
          fontWeight:950,
        }}
      >
        {value}
      </div>
    </div>
  );
}
