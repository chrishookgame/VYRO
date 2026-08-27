"use client";

import type {
  CSSProperties,
  PropsWithChildren,
} from "react";

export type VyroGiftFxTheme =
  | "rose"
  | "heart"
  | "diamond"
  | "phoenix"
  | "galaxy"
  | "crown"
  | "universe";

interface VyroGiftFxStageProps
  extends PropsWithChildren {
  theme: VyroGiftFxTheme;
  title: string;
  subtitle?: string;
  symbol: string;
}

const themeClass: Record<
  VyroGiftFxTheme,
  string
> = {
  rose: "vyro-gift-fx--rose",
  heart: "vyro-gift-fx--heart",
  diamond: "vyro-gift-fx--diamond",
  phoenix: "vyro-gift-fx--phoenix",
  galaxy: "vyro-gift-fx--galaxy",
  crown: "vyro-gift-fx--crown",
  universe: "vyro-gift-fx--universe",
};

const particleCount: Record<
  VyroGiftFxTheme,
  number
> = {
  rose: 26,
  heart: 28,
  diamond: 32,
  phoenix: 38,
  galaxy: 44,
  crown: 38,
  universe: 48,
};

export default function VyroGiftFxStage({
  theme,
  title,
  subtitle,
  symbol,
  children,
}: VyroGiftFxStageProps) {
  const particles =
    Array.from({
      length: particleCount[theme],
    });

  return (
    <div
      className={[
        "vyro-gift-fx",
        themeClass[theme],
      ].join(" ")}
      data-vyro-gift-fx={theme}
    >
      <div className="vyro-gift-fx__ambient" />
      <div className="vyro-gift-fx__vignette" />
      <div className="vyro-gift-fx__beam" />

      {theme === "rose" ? (
        <div className="vyro-gift-fx__petal-field">
          {Array.from({
            length: 14,
          }).map((_, index) => (
            <span
              key={index}
              className="vyro-gift-fx__petal"
              style={
                {
                  "--special-x":
                    `${(index * 29 + 7) % 96}%`,
                  "--special-delay":
                    `${(index % 7) * 180}ms`,
                  "--special-rotate":
                    `${(index * 41) % 180}deg`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      {theme === "heart" ? (
        <>
          <div className="vyro-gift-fx__heart-wave vyro-gift-fx__heart-wave--one" />
          <div className="vyro-gift-fx__heart-wave vyro-gift-fx__heart-wave--two" />

          <div className="vyro-gift-fx__heart-rain">
            {Array.from({
              length: 10,
            }).map((_, index) => (
              <span
                key={index}
                className="vyro-gift-fx__floating-heart"
                style={
                  {
                    "--special-x":
                      `${(index * 31 + 8) % 92}%`,
                    "--special-delay":
                      `${(index % 5) * 240}ms`,
                  } as CSSProperties
                }
              >
                ♥
              </span>
            ))}
          </div>
        </>
      ) : null}

      {theme === "diamond" ? (
        <div className="vyro-gift-fx__crystal-field">
          {Array.from({
            length: 12,
          }).map((_, index) => (
            <span
              key={index}
              className="vyro-gift-fx__crystal"
              style={
                {
                  "--special-x":
                    `${(index * 37 + 4) % 94}%`,
                  "--special-y":
                    `${(index * 23 + 6) % 78}%`,
                  "--special-delay":
                    `${(index % 6) * 150}ms`,
                  "--special-rotate":
                    `${(index * 33) % 180}deg`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      {theme === "phoenix" ? (
        <>
          <div className="vyro-gift-fx__phoenix-wing vyro-gift-fx__phoenix-wing--left" />
          <div className="vyro-gift-fx__phoenix-wing vyro-gift-fx__phoenix-wing--right" />

          <div className="vyro-gift-fx__flame-field">
            {Array.from({
              length: 14,
            }).map((_, index) => (
              <span
                key={index}
                className="vyro-gift-fx__flame"
                style={
                  {
                    "--special-x":
                      `${(index * 31 + 4) % 94}%`,
                    "--special-delay":
                      `${(index % 7) * 120}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </>
      ) : null}

      {theme === "galaxy" ? (
        <>
          <div className="vyro-gift-fx__galaxy-core" />
          <div className="vyro-gift-fx__galaxy-disk" />

          <div className="vyro-gift-fx__star-field">
            {Array.from({
              length: 30,
            }).map((_, index) => (
              <span
                key={index}
                className="vyro-gift-fx__star"
                style={
                  {
                    "--special-x":
                      `${(index * 43 + 3) % 97}%`,
                    "--special-y":
                      `${(index * 29 + 5) % 88}%`,
                    "--special-delay":
                      `${(index % 8) * 140}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </>
      ) : null}

      {theme === "crown" ? (
        <>
          <div className="vyro-gift-fx__royal-rays">
            {Array.from({
              length: 12,
            }).map((_, index) => (
              <span
                key={index}
                className="vyro-gift-fx__royal-ray"
                style={
                  {
                    "--ray-angle":
                      `${index * 30}deg`,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <div className="vyro-gift-fx__royal-platform" />
        </>
      ) : null}

      {theme === "universe" ? (
        <>
          <div className="vyro-gift-fx__portal" />
          <div className="vyro-gift-fx__portal-core" />

          <span className="vyro-gift-fx__planet vyro-gift-fx__planet--one" />
          <span className="vyro-gift-fx__planet vyro-gift-fx__planet--two" />
          <span className="vyro-gift-fx__planet vyro-gift-fx__planet--three" />
        </>
      ) : null}

      <div className="vyro-gift-fx__orbit vyro-gift-fx__orbit--one" />
      <div className="vyro-gift-fx__orbit vyro-gift-fx__orbit--two" />
      <div className="vyro-gift-fx__orbit vyro-gift-fx__orbit--three" />

      <div className="vyro-gift-fx__particles">
        {particles.map((_, index) => {
          const style = {
            "--vyro-x":
              `${(index * 37) % 100}%`,
            "--vyro-delay":
              `${(index % 8) * 110}ms`,
            "--vyro-duration":
              `${1700 + (index % 7) * 260}ms`,
            "--vyro-size":
              `${5 + (index % 5) * 3}px`,
          } as CSSProperties;

          return (
            <span
              key={index}
              className="vyro-gift-fx__particle"
              style={style}
            />
          );
        })}
      </div>

      <div className="vyro-gift-fx__shockwave" />

      <div className="vyro-gift-fx__hero">
        <div className="vyro-gift-fx__hero-glow" />

        <div className="vyro-gift-fx__symbol">
          {symbol}
        </div>

        <div className="vyro-gift-fx__energy-ring" />
      </div>

      <div className="vyro-gift-fx__content">
        <p className="vyro-gift-fx__brand">
          VYRO
        </p>

        <h2 className="vyro-gift-fx__title">
          {title}
        </h2>

        {subtitle ? (
          <p className="vyro-gift-fx__subtitle">
            {subtitle}
          </p>
        ) : null}

        {children}
      </div>

      <style jsx>{`
        .vyro-gift-fx {
          --vyro-primary: 34 211 238;
          --vyro-secondary: 168 85 247;

          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          isolation: isolate;
          color: white;
          animation:
            vyroGiftEntrance 520ms
            cubic-bezier(.16,1,.3,1)
            both;
        }

        .vyro-gift-fx--rose {
          --vyro-primary: 251 113 133;
          --vyro-secondary: 244 63 94;
        }

        .vyro-gift-fx--heart {
          --vyro-primary: 244 114 182;
          --vyro-secondary: 239 68 68;
        }

        .vyro-gift-fx--diamond {
          --vyro-primary: 103 232 249;
          --vyro-secondary: 59 130 246;
        }

        .vyro-gift-fx--phoenix {
          --vyro-primary: 251 146 60;
          --vyro-secondary: 239 68 68;
        }

        .vyro-gift-fx--galaxy {
          --vyro-primary: 129 140 248;
          --vyro-secondary: 217 70 239;
        }

        .vyro-gift-fx--crown {
          --vyro-primary: 250 204 21;
          --vyro-secondary: 245 158 11;
        }

        .vyro-gift-fx--universe {
          --vyro-primary: 217 70 239;
          --vyro-secondary: 99 102 241;
        }

        .vyro-gift-fx__ambient {
          position: absolute;
          inset: 8% 4%;
          border-radius: 999px;
          background:
            radial-gradient(
              circle,
              rgb(var(--vyro-primary) / .32),
              rgb(var(--vyro-secondary) / .12) 38%,
              transparent 72%
            );
          filter: blur(26px);
          animation:
            vyroAmbientPulse 1800ms ease-in-out
            infinite alternate;
        }

        .vyro-gift-fx__vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at 50% 44%,
              transparent 0 30%,
              rgb(0 0 0 / .08) 58%,
              rgb(0 0 0 / .38) 100%
            );
        }

        .vyro-gift-fx__beam {
          position: absolute;
          left: 50%;
          bottom: -18%;
          width: 38%;
          height: 115%;
          transform:
            translateX(-50%)
            perspective(500px)
            rotateX(12deg);
          background:
            linear-gradient(
              to top,
              rgb(var(--vyro-primary) / .3),
              rgb(var(--vyro-primary) / .05),
              transparent
            );
          filter: blur(14px);
          clip-path:
            polygon(
              34% 100%,
              66% 100%,
              100% 0,
              0 0
            );
          animation:
            vyroBeam 1600ms ease-in-out
            infinite alternate;
        }

        .vyro-gift-fx__orbit {
          position: absolute;
          left: 50%;
          top: 43%;
          border:
            1px solid
            rgb(var(--vyro-primary) / .45);
          border-radius: 50%;
          transform:
            translate(-50%, -50%);
          box-shadow:
            0 0 18px
            rgb(var(--vyro-primary) / .22);
        }

        .vyro-gift-fx__orbit--one {
          width: 260px;
          height: 90px;
          animation:
            vyroOrbitOne 4200ms linear infinite;
        }

        .vyro-gift-fx__orbit--two {
          width: 210px;
          height: 150px;
          animation:
            vyroOrbitTwo 3600ms linear
            infinite reverse;
        }

        .vyro-gift-fx__orbit--three {
          width: 160px;
          height: 210px;
          opacity: .55;
          animation:
            vyroOrbitThree 5000ms
            linear infinite;
        }

        .vyro-gift-fx--rose
        .vyro-gift-fx__orbit,
        .vyro-gift-fx--heart
        .vyro-gift-fx__orbit,
        .vyro-gift-fx--phoenix
        .vyro-gift-fx__orbit,
        .vyro-gift-fx--crown
        .vyro-gift-fx__orbit {
          opacity: .22;
        }

        .vyro-gift-fx__particles,
        .vyro-gift-fx__petal-field,
        .vyro-gift-fx__heart-rain,
        .vyro-gift-fx__crystal-field,
        .vyro-gift-fx__flame-field,
        .vyro-gift-fx__star-field {
          position: absolute;
          inset: 0;
        }

        .vyro-gift-fx__particle {
          position: absolute;
          left: var(--vyro-x);
          bottom: 4%;
          width: var(--vyro-size);
          height: var(--vyro-size);
          border-radius: 999px;
          background:
            rgb(var(--vyro-primary));
          box-shadow:
            0 0 12px
            rgb(var(--vyro-primary));
          opacity: 0;
          animation:
            vyroParticleRise
            var(--vyro-duration)
            ease-out
            var(--vyro-delay)
            infinite;
        }

        .vyro-gift-fx__petal {
          position: absolute;
          left: var(--special-x);
          top: -10%;
          width: 18px;
          height: 28px;
          border-radius: 80% 20% 70% 30%;
          background:
            linear-gradient(
              135deg,
              rgb(255 228 230 / .95),
              rgb(var(--vyro-primary) / .9)
            );
          box-shadow:
            0 0 14px
            rgb(var(--vyro-primary) / .4);
          transform:
            rotate(var(--special-rotate));
          animation:
            vyroPetalFall 2900ms
            ease-in
            var(--special-delay)
            infinite;
        }

        .vyro-gift-fx__heart-wave {
          position: absolute;
          left: 50%;
          top: 43%;
          width: 130px;
          height: 130px;
          border:
            3px solid
            rgb(var(--vyro-primary) / .7);
          border-radius: 50%;
          transform:
            translate(-50%, -50%);
          animation:
            vyroHeartWave 1500ms
            ease-out infinite;
        }

        .vyro-gift-fx__heart-wave--two {
          animation-delay: 650ms;
        }

        .vyro-gift-fx__floating-heart {
          position: absolute;
          left: var(--special-x);
          bottom: 3%;
          color:
            rgb(var(--vyro-primary));
          font-size: 30px;
          text-shadow:
            0 0 14px
            rgb(var(--vyro-primary));
          opacity: 0;
          animation:
            vyroHeartRise 2600ms
            ease-out
            var(--special-delay)
            infinite;
        }

        .vyro-gift-fx__crystal {
          position: absolute;
          left: var(--special-x);
          top: var(--special-y);
          width: 10px;
          height: 30px;
          clip-path:
            polygon(
              50% 0,
              100% 35%,
              72% 100%,
              28% 100%,
              0 35%
            );
          background:
            linear-gradient(
              135deg,
              white,
              rgb(var(--vyro-primary)),
              rgb(var(--vyro-secondary))
            );
          filter:
            drop-shadow(
              0 0 9px
              rgb(var(--vyro-primary))
            );
          transform:
            rotate(var(--special-rotate));
          opacity: .1;
          animation:
            vyroCrystalFlash 1900ms
            ease-in-out
            var(--special-delay)
            infinite;
        }

        .vyro-gift-fx__phoenix-wing {
          position: absolute;
          top: 33%;
          width: 34%;
          height: 38%;
          background:
            radial-gradient(
              ellipse at center,
              rgb(254 215 170 / .95),
              rgb(var(--vyro-primary) / .75) 38%,
              rgb(var(--vyro-secondary) / .15) 70%,
              transparent 74%
            );
          filter:
            blur(2px)
            drop-shadow(
              0 0 28px
              rgb(var(--vyro-primary) / .7)
            );
        }

        .vyro-gift-fx__phoenix-wing--left {
          left: 12%;
          border-radius: 95% 10% 80% 10%;
          transform-origin: right center;
          animation:
            vyroWingLeft 900ms
            ease-in-out infinite alternate;
        }

        .vyro-gift-fx__phoenix-wing--right {
          right: 12%;
          border-radius: 10% 95% 10% 80%;
          transform-origin: left center;
          animation:
            vyroWingRight 900ms
            ease-in-out infinite alternate;
        }

        .vyro-gift-fx__flame {
          position: absolute;
          left: var(--special-x);
          bottom: -8%;
          width: 18px;
          height: 70px;
          border-radius: 50% 50% 20% 20%;
          background:
            linear-gradient(
              to top,
              rgb(239 68 68 / .15),
              rgb(var(--vyro-primary) / .9),
              rgb(254 240 138 / .9)
            );
          filter:
            blur(2px)
            drop-shadow(
              0 0 15px
              rgb(var(--vyro-primary))
            );
          opacity: 0;
          animation:
            vyroFlameRise 1500ms
            ease-out
            var(--special-delay)
            infinite;
        }

        .vyro-gift-fx__galaxy-core {
          position: absolute;
          left: 50%;
          top: 43%;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          transform:
            translate(-50%, -50%);
          background:
            radial-gradient(
              circle,
              white,
              rgb(var(--vyro-primary)) 28%,
              rgb(var(--vyro-secondary) / .4) 54%,
              transparent 72%
            );
          filter:
            blur(1px);
          box-shadow:
            0 0 80px
            rgb(var(--vyro-secondary) / .8);
          animation:
            vyroGalaxyCore 1300ms
            ease-in-out infinite alternate;
        }

        .vyro-gift-fx__galaxy-disk {
          position: absolute;
          left: 50%;
          top: 43%;
          width: 440px;
          height: 120px;
          border-radius: 50%;
          transform:
            translate(-50%, -50%)
            rotate(-18deg);
          border:
            8px solid
            rgb(var(--vyro-primary) / .2);
          box-shadow:
            inset 0 0 30px
            rgb(var(--vyro-secondary) / .25),
            0 0 45px
            rgb(var(--vyro-primary) / .2);
          animation:
            vyroGalaxySpin 5200ms linear infinite;
        }

        .vyro-gift-fx__star {
          position: absolute;
          left: var(--special-x);
          top: var(--special-y);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: white;
          box-shadow:
            0 0 8px white,
            0 0 16px
            rgb(var(--vyro-primary));
          animation:
            vyroStarBlink 1300ms
            ease-in-out
            var(--special-delay)
            infinite alternate;
        }

        .vyro-gift-fx__royal-rays {
          position: absolute;
          left: 50%;
          top: 43%;
          width: 360px;
          height: 360px;
          transform:
            translate(-50%, -50%);
          animation:
            vyroRoyalRotate 10000ms
            linear infinite;
        }

        .vyro-gift-fx__royal-ray {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 3px;
          height: 180px;
          transform-origin:
            center top;
          transform:
            rotate(var(--ray-angle));
          background:
            linear-gradient(
              to bottom,
              rgb(var(--vyro-primary) / .8),
              transparent
            );
          filter:
            drop-shadow(
              0 0 8px
              rgb(var(--vyro-primary))
            );
        }

        .vyro-gift-fx__royal-platform {
          position: absolute;
          left: 50%;
          top: 64%;
          width: 280px;
          height: 28px;
          transform:
            translateX(-50%);
          border-radius: 50%;
          background:
            rgb(var(--vyro-primary) / .35);
          filter: blur(9px);
          box-shadow:
            0 0 35px
            rgb(var(--vyro-primary) / .7);
          animation:
            vyroPlatformPulse 1200ms
            ease-in-out infinite alternate;
        }

        .vyro-gift-fx__portal {
          position: absolute;
          left: 50%;
          top: 43%;
          width: 330px;
          height: 330px;
          border-radius: 50%;
          transform:
            translate(-50%, -50%);
          border:
            4px solid
            rgb(var(--vyro-primary) / .6);
          box-shadow:
            inset 0 0 45px
            rgb(var(--vyro-primary) / .5),
            0 0 70px
            rgb(var(--vyro-secondary) / .5);
          animation:
            vyroPortal 4200ms
            linear infinite;
        }

        .vyro-gift-fx__portal-core {
          position: absolute;
          left: 50%;
          top: 43%;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          transform:
            translate(-50%, -50%);
          background:
            conic-gradient(
              from 0deg,
              transparent,
              rgb(var(--vyro-primary) / .35),
              transparent,
              rgb(var(--vyro-secondary) / .38),
              transparent
            );
          filter: blur(4px);
          animation:
            vyroPortalCore 3100ms
            linear infinite reverse;
        }

        .vyro-gift-fx__planet {
          position: absolute;
          border-radius: 50%;
          box-shadow:
            inset -8px -8px 15px
            rgb(0 0 0 / .35),
            0 0 22px
            rgb(var(--vyro-primary) / .5);
        }

        .vyro-gift-fx__planet--one {
          left: 21%;
          top: 23%;
          width: 34px;
          height: 34px;
          background:
            linear-gradient(
              135deg,
              #67e8f9,
              #2563eb
            );
          animation:
            vyroPlanetOne 4200ms
            ease-in-out infinite alternate;
        }

        .vyro-gift-fx__planet--two {
          right: 17%;
          top: 34%;
          width: 48px;
          height: 48px;
          background:
            linear-gradient(
              135deg,
              #f0abfc,
              #7c3aed
            );
          animation:
            vyroPlanetTwo 5100ms
            ease-in-out infinite alternate;
        }

        .vyro-gift-fx__planet--three {
          left: 29%;
          bottom: 18%;
          width: 25px;
          height: 25px;
          background:
            linear-gradient(
              135deg,
              #fde68a,
              #f97316
            );
          animation:
            vyroPlanetThree 3600ms
            ease-in-out infinite alternate;
        }

        .vyro-gift-fx__shockwave {
          position: absolute;
          left: 50%;
          top: 43%;
          width: 100px;
          height: 100px;
          border:
            2px solid
            rgb(var(--vyro-primary) / .75);
          border-radius: 50%;
          transform:
            translate(-50%, -50%);
          animation:
            vyroShockwave 1800ms
            ease-out infinite;
        }

        .vyro-gift-fx__hero {
          position: absolute;
          left: 50%;
          top: 43%;
          width: 220px;
          height: 220px;
          transform:
            translate(-50%, -50%);
          display: grid;
          place-items: center;
          animation:
            vyroHeroFloat 2200ms
            ease-in-out infinite alternate;
        }

        .vyro-gift-fx__hero-glow {
          position: absolute;
          inset: 16%;
          border-radius: 50%;
          background:
            rgb(var(--vyro-primary) / .42);
          filter: blur(30px);
          animation:
            vyroHeroGlow 900ms
            ease-in-out infinite alternate;
        }

        .vyro-gift-fx__symbol {
          position: relative;
          z-index: 3;
          font-size:
            clamp(5rem, 13vw, 9rem);
          line-height: 1;
          filter:
            drop-shadow(
              0 0 14px
              rgb(var(--vyro-primary) / .8)
            )
            drop-shadow(
              0 18px 24px
              rgb(0 0 0 / .45)
            );
          animation:
            vyroSymbolReveal 900ms
            cubic-bezier(.16,1,.3,1)
            both;
        }

        .vyro-gift-fx--phoenix
        .vyro-gift-fx__symbol {
          animation:
            vyroPhoenixRise 1600ms
            cubic-bezier(.16,1,.3,1)
            both;
        }

        .vyro-gift-fx--heart
        .vyro-gift-fx__symbol {
          animation:
            vyroHeartBeat 900ms
            ease-in-out infinite;
        }

        .vyro-gift-fx--diamond
        .vyro-gift-fx__symbol {
          animation:
            vyroDiamondFloat 1900ms
            ease-in-out infinite alternate;
        }

        .vyro-gift-fx--crown
        .vyro-gift-fx__symbol {
          animation:
            vyroCrownDrop 1100ms
            cubic-bezier(.16,1,.3,1)
            both;
        }

        .vyro-gift-fx__energy-ring {
          position: absolute;
          inset: 5%;
          border:
            2px solid
            rgb(var(--vyro-primary) / .55);
          border-radius: 50%;
          box-shadow:
            inset 0 0 30px
            rgb(var(--vyro-primary) / .15),
            0 0 28px
            rgb(var(--vyro-primary) / .2);
          animation:
            vyroEnergyRing 2400ms
            linear infinite;
        }

        .vyro-gift-fx__content {
          position: absolute;
          z-index: 20;
          left: 50%;
          bottom: 6%;
          width: min(92%, 620px);
          transform:
            translateX(-50%);
          text-align: center;
          text-shadow:
            0 4px 20px
            rgb(0 0 0 / .85);
          animation:
            vyroContentReveal 700ms
            220ms ease-out both;
        }

        .vyro-gift-fx__brand {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .42em;
          color:
            rgb(var(--vyro-primary));
        }

        .vyro-gift-fx__title {
          margin-top: 5px;
          font-size:
            clamp(1.45rem, 5vw, 3rem);
          line-height: 1;
          font-weight: 950;
        }

        .vyro-gift-fx__subtitle {
          margin-top: 7px;
          font-size:
            clamp(.72rem, 2vw, .95rem);
          font-weight: 800;
          color:
            rgb(255 255 255 / .78);
        }

        @keyframes vyroGiftEntrance {
          from {
            opacity: 0;
            transform: scale(.88);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes vyroAmbientPulse {
          from {
            opacity: .42;
            transform: scale(.86);
          }

          to {
            opacity: .9;
            transform: scale(1.12);
          }
        }

        @keyframes vyroBeam {
          from {
            opacity: .22;
          }

          to {
            opacity: .82;
          }
        }

        @keyframes vyroOrbitOne {
          from {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }
        }

        @keyframes vyroOrbitTwo {
          from {
            transform:
              translate(-50%, -50%)
              rotate(35deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(395deg);
          }
        }

        @keyframes vyroOrbitThree {
          from {
            transform:
              translate(-50%, -50%)
              rotate(70deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(430deg);
          }
        }

        @keyframes vyroParticleRise {
          0% {
            opacity: 0;
            transform:
              translate3d(0, 30px, 0)
              scale(.4);
          }

          18% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translate3d(20px, -420px, 0)
              scale(1.3);
          }
        }

        @keyframes vyroShockwave {
          0% {
            opacity: .8;
            transform:
              translate(-50%, -50%)
              scale(.35);
          }

          100% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(4.5);
          }
        }

        @keyframes vyroHeroFloat {
          from {
            transform:
              translate(-50%, -50%)
              translateY(8px);
          }

          to {
            transform:
              translate(-50%, -50%)
              translateY(-12px);
          }
        }

        @keyframes vyroHeroGlow {
          from {
            opacity: .4;
            transform: scale(.75);
          }

          to {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes vyroSymbolReveal {
          0% {
            opacity: 0;
            transform:
              translateY(45px)
              scale(.25)
              rotate(-16deg);
          }

          70% {
            opacity: 1;
            transform:
              translateY(-5px)
              scale(1.12)
              rotate(3deg);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1)
              rotate(0);
          }
        }

        @keyframes vyroEnergyRing {
          from {
            transform:
              rotate(0deg)
              scale(.94);
          }

          50% {
            transform:
              rotate(180deg)
              scale(1.06);
          }

          to {
            transform:
              rotate(360deg)
              scale(.94);
          }
        }

        @keyframes vyroContentReveal {
          from {
            opacity: 0;
            transform:
              translate(-50%, 28px);
          }

          to {
            opacity: 1;
            transform:
              translate(-50%, 0);
          }
        }

        @keyframes vyroPetalFall {
          0% {
            opacity: 0;
            transform:
              translateY(-20px)
              translateX(0)
              rotate(var(--special-rotate));
          }

          15% {
            opacity: .95;
          }

          100% {
            opacity: 0;
            transform:
              translateY(520px)
              translateX(65px)
              rotate(420deg);
          }
        }

        @keyframes vyroHeartWave {
          0% {
            opacity: .85;
            transform:
              translate(-50%, -50%)
              scale(.35);
          }

          100% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(3.4);
          }
        }

        @keyframes vyroHeartRise {
          0% {
            opacity: 0;
            transform:
              translateY(30px)
              scale(.5);
          }

          20% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translateY(-420px)
              translateX(35px)
              scale(1.25);
          }
        }

        @keyframes vyroHeartBeat {
          0%,
          100% {
            transform: scale(1);
          }

          15% {
            transform: scale(1.16);
          }

          30% {
            transform: scale(1);
          }

          45% {
            transform: scale(1.1);
          }
        }

        @keyframes vyroCrystalFlash {
          0%,
          100% {
            opacity: .1;
            transform:
              rotate(var(--special-rotate))
              scale(.6);
          }

          50% {
            opacity: 1;
            transform:
              rotate(
                calc(
                  var(--special-rotate) + 90deg
                )
              )
              scale(1.3);
          }
        }

        @keyframes vyroDiamondFloat {
          from {
            transform:
              translateY(7px)
              rotate(-5deg)
              scale(.96);
          }

          to {
            transform:
              translateY(-10px)
              rotate(5deg)
              scale(1.07);
          }
        }

        @keyframes vyroWingLeft {
          from {
            transform:
              rotate(-14deg)
              scaleX(.86);
          }

          to {
            transform:
              rotate(12deg)
              scaleX(1.08);
          }
        }

        @keyframes vyroWingRight {
          from {
            transform:
              rotate(14deg)
              scaleX(.86);
          }

          to {
            transform:
              rotate(-12deg)
              scaleX(1.08);
          }
        }

        @keyframes vyroFlameRise {
          0% {
            opacity: 0;
            transform:
              translateY(30px)
              scaleY(.4);
          }

          20% {
            opacity: .95;
          }

          100% {
            opacity: 0;
            transform:
              translateY(-420px)
              scaleY(1.6);
          }
        }

        @keyframes vyroPhoenixRise {
          0% {
            opacity: 0;
            transform:
              translateY(120px)
              scale(.35);
          }

          65% {
            opacity: 1;
            transform:
              translateY(-18px)
              scale(1.14);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes vyroGalaxyCore {
          from {
            transform:
              translate(-50%, -50%)
              scale(.75);
          }

          to {
            transform:
              translate(-50%, -50%)
              scale(1.18);
          }
        }

        @keyframes vyroGalaxySpin {
          from {
            transform:
              translate(-50%, -50%)
              rotate(-18deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(342deg);
          }
        }

        @keyframes vyroStarBlink {
          from {
            opacity: .15;
            transform: scale(.5);
          }

          to {
            opacity: 1;
            transform: scale(1.6);
          }
        }

        @keyframes vyroRoyalRotate {
          from {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }
        }

        @keyframes vyroPlatformPulse {
          from {
            opacity: .4;
            transform:
              translateX(-50%)
              scaleX(.75);
          }

          to {
            opacity: 1;
            transform:
              translateX(-50%)
              scaleX(1.15);
          }
        }

        @keyframes vyroCrownDrop {
          0% {
            opacity: 0;
            transform:
              translateY(-130px)
              scale(.45)
              rotate(-12deg);
          }

          70% {
            opacity: 1;
            transform:
              translateY(12px)
              scale(1.12)
              rotate(4deg);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes vyroPortal {
          from {
            transform:
              translate(-50%, -50%)
              rotate(0deg)
              scale(.92);
          }

          50% {
            transform:
              translate(-50%, -50%)
              rotate(180deg)
              scale(1.07);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(360deg)
              scale(.92);
          }
        }

        @keyframes vyroPortalCore {
          from {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }
        }

        @keyframes vyroPlanetOne {
          from {
            transform:
              translate(-8px, 12px);
          }

          to {
            transform:
              translate(28px, -16px);
          }
        }

        @keyframes vyroPlanetTwo {
          from {
            transform:
              translate(10px, -10px);
          }

          to {
            transform:
              translate(-30px, 20px);
          }
        }

        @keyframes vyroPlanetThree {
          from {
            transform:
              translate(-12px, 4px);
          }

          to {
            transform:
              translate(22px, -22px);
          }
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          .vyro-gift-fx,
          .vyro-gift-fx * {
            animation-duration:
              1ms !important;
            animation-iteration-count:
              1 !important;
          }
        }
      `}</style>
    </div>
  );
}