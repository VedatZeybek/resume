import { useId } from "react";
import type { Project } from "../../data/projects";

export function ProjectVisual({
  kind,
  image,
}: {
  kind: Project["kind"];
  image?: Project["image"];
}) {
  const gradientId = useId();
  if (image) {
    return (
      <div className={`project-visual project-photo visual-${kind}`}>
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </div>
    );
  }
  return (
    <div className={`project-visual visual-${kind}`} aria-hidden="true">
      {kind === "minishell" && (
        <svg viewBox="0 0 300 160" fill="none">
          <rect
            x="38" y="23" width="224" height="108" rx="7"
            fill="#111c29" stroke="currentColor" strokeOpacity=".45"
          />
          <path d="M38 44H262" stroke="currentColor" strokeOpacity=".25" />
          {[51, 62, 73].map((x) => (
            <circle key={x} cx={x} cy="34" r="2" fill="currentColor" opacity=".5" />
          ))}
          <path d="M55 62l7 6-7 6m14 0h8" stroke="currentColor" />
          <text x="87" y="72" fill="currentColor" fontSize="10" fontFamily="monospace">
            cat input | grep shell
          </text>
          <path d="M55 87H161M55 96H131" stroke="currentColor" strokeOpacity=".25" />
          <path d="M55 108l7 6-7 6m14 0h8" stroke="currentColor" />
          <text
            x="150" y="151" textAnchor="middle" fill="currentColor"
            fontSize="8.5" letterSpacing="1.5" opacity=".6"
          >
            PARSE · PIPE · EXECUTE
          </text>
        </svg>
      )}
      {kind === "memory" && (
        <svg viewBox="0 0 300 160" fill="none">
          <ellipse
            cx="150"
            cy="78"
            rx="110"
            ry="43"
            stroke="currentColor"
            opacity=".12"
          />
          <ellipse
            cx="150"
            cy="78"
            rx="68"
            ry="66"
            stroke="currentColor"
            opacity=".08"
            transform="rotate(-30 150 78)"
          />
          <path
            d="M65 43L150 78L235 43M65 115L150 78L235 115M150 28V128"
            stroke="currentColor"
            opacity=".25"
          />
          {[
            [65, 43],
            [235, 43],
            [65, 115],
            [235, 115],
            [150, 28],
            [150, 128],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="5"
                fill="#0d1522"
                stroke="currentColor"
                opacity=".65"
              />
              <circle cx={x} cy={y} r="1.4" fill="currentColor" />
            </g>
          ))}
          <rect
            x="128"
            y="56"
            width="44"
            height="44"
            rx="10"
            fill="#111c2b"
            stroke="currentColor"
            strokeOpacity=".5"
          />
          <path
            d="M140 70V81C140 90 160 90 160 81V70"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <text
            x="150"
            y="151"
            textAnchor="middle"
            fill="currentColor"
            fontSize="8.5"
            letterSpacing="1.5"
            opacity=".6"
          >
            CONTEXT, CONNECTED.
          </text>
        </svg>
      )}
      {kind === "assistant" && (
        <svg viewBox="0 0 300 160" fill="none">
          {[
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22,
          ].map((i) => {
            const h = 10 + Math.sin(i * 0.9) ** 2 * 48;
            return (
              <path
                key={i}
                d={`M${40 + i * 10} ${73 - h / 2}v${h}`}
                stroke="currentColor"
                opacity={0.16 + Math.sin(i * 0.7) ** 2 * 0.35}
              />
            );
          })}
          <rect
            x="74"
            y="99"
            width="152"
            height="25"
            rx="12"
            fill="#131d2a"
            stroke="currentColor"
            strokeOpacity=".3"
          />
          <circle cx="88" cy="112" r="2" fill="currentColor" />
          <text
            x="100"
            y="114"
            fill="currentColor"
            fontSize="7"
            letterSpacing="1"
          >
            ASK. RETRIEVE. RESOLVE.
          </text>
          <path d="M145 26l5-8 5 8-5-3z" stroke="currentColor" opacity=".7" />
          <text
            x="150"
            y="151"
            textAnchor="middle"
            fill="currentColor"
            fontSize="8.5"
            letterSpacing="1.5"
            opacity=".6"
          >
            KNOWLEDGE INTO ANSWERS.
          </text>
        </svg>
      )}
      {kind === "community" && (
        <svg viewBox="0 0 300 160" fill="none">
          <path
            d="M150 28V45M80 62V45H220V62M80 96V113H220V96M150 113V130"
            stroke="currentColor"
            opacity=".3"
          />
          {[80, 150, 220].map((x, i) => (
            <g key={x}>
              <rect
                x={x - 22}
                y="59"
                width="44"
                height="37"
                rx="5"
                fill="#111923"
                stroke="currentColor"
                strokeOpacity=".35"
              />
              <circle cx={x} cy="72" r="4" stroke="currentColor" opacity=".7" />
              <path
                d={`M${x - 7} 87q0-10 7-10t7 10`}
                stroke="currentColor"
                opacity=".6"
              />
              {i === 1 && <circle cx={x + 19} cy="60" r="3" fill="#afc1d6" />}
            </g>
          ))}
          <circle cx="150" cy="25" r="4" stroke="currentColor" />
          <circle cx="150" cy="130" r="2" fill="currentColor" />
          <text
            x="150"
            y="151"
            textAnchor="middle"
            fill="currentColor"
            fontSize="8.5"
            letterSpacing="1.5"
            opacity=".6"
          >
            PEOPLE. ROLES. POSSIBILITIES.
          </text>
        </svg>
      )}
      {kind === "webserv" && (
        <svg viewBox="0 0 300 160" fill="none">
          <path
            d="M64 45H117M64 80H117M64 115H117M184 80H240"
            stroke="currentColor"
            opacity=".35"
          />
          {[45, 80, 115].map((y) => (
            <g key={y}>
              <rect
                x="34"
                y={y - 11}
                width="30"
                height="22"
                rx="4"
                fill="#121d2a"
                stroke="currentColor"
                strokeOpacity=".4"
              />
              <path d={`M43 ${y - 3}l4 3-4 3m8 0h5`} stroke="currentColor" />
            </g>
          ))}
          <rect
            x="117"
            y="35"
            width="67"
            height="90"
            rx="7"
            fill="#111c29"
            stroke="currentColor"
            strokeOpacity=".55"
          />
          {[52, 73, 94].map((y) => (
            <g key={y}>
              <rect
                x="128"
                y={y}
                width="44"
                height="13"
                rx="2"
                stroke="currentColor"
                strokeOpacity=".4"
              />
              <circle cx="136" cy={y + 6.5} r="1.5" fill="currentColor" />
              <path
                d={`M146 ${y + 6.5}h18`}
                stroke="currentColor"
                strokeOpacity=".35"
              />
            </g>
          ))}
          <circle
            cx="247"
            cy="80"
            r="9"
            stroke="currentColor"
            strokeOpacity=".5"
          />
          <path d="M243 80l3 3 5-6" stroke="currentColor" />
          <text
            x="150"
            y="150"
            textAnchor="middle"
            fill="currentColor"
            fontSize="9"
            letterSpacing="1.8"
            opacity=".7"
          >
            REQUEST · PROCESS · RESPOND
          </text>
        </svg>
      )}
      {kind === "minirt" && (
        <svg viewBox="0 0 300 160" fill="none">
          <defs>
            <radialGradient id={gradientId} cx="30%" cy="25%" r="75%">
              <stop stopColor="#a7bacf" />
              <stop offset=".45" stopColor="#475b76" />
              <stop offset="1" stopColor="#101723" />
            </radialGradient>
          </defs>
          <path
            d="M28 123l116-55 131 55-121 24z"
            fill="#151f2d"
            fillOpacity=".6"
            stroke="currentColor"
            strokeOpacity=".13"
          />
          <ellipse
            cx="165"
            cy="115"
            rx="41"
            ry="8"
            fill="#05090e"
            opacity=".65"
          />
          <circle
            cx="158"
            cy="83"
            r="32"
            fill={`url(#${gradientId})`}
            stroke="currentColor"
            strokeOpacity=".3"
          />
          <path
            d="M58 38l78 27m-78-27l86 55m-86-55l101 76M139 65l29-33"
            stroke="currentColor"
            strokeOpacity=".35"
          />
          <rect
            x="43"
            y="28"
            width="17"
            height="19"
            rx="3"
            fill="#121c29"
            stroke="currentColor"
            strokeOpacity=".6"
          />
          <path d="M48 35l6 3-6 3z" fill="currentColor" />
          <circle cx="173" cy="27" r="3" fill="#c2d0e2" />
          <text
            x="150"
            y="157"
            textAnchor="middle"
            fill="currentColor"
            fontSize="9"
            letterSpacing="1.8"
            opacity=".7"
          >
            RAYS · GEOMETRY · LIGHT
          </text>
        </svg>
      )}
    </div>
  );
}
