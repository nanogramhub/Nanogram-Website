import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

const Mail = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    height={200}
    width={200}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    xmlSpace="preserve"
    {...props}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <style>
        {"\n      .st1{opacity:.2}.st2{fill:#231f20}.st3{fill:#e0e0d1}\n    "}
      </style>
      <g id="Layer_1">
        <circle
          cx={32}
          cy={32}
          r={32}
          style={{
            fill: "#77b3d4",
          }}
        />
        <g className="st1">
          <path
            className="st2"
            d="M52 44c0 2.2-1.8 4-4 4H16c-2.2 0-4-1.8-4-4V24c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4z"
          />
        </g>
        <path
          className="st3"
          d="M52 42c0 2.2-1.8 4-4 4H16c-2.2 0-4-1.8-4-4V22c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4z"
        />
        <g className="st1">
          <path
            className="st2"
            d="M35.5 30.2c-1.9-2.1-5.1-2.1-7 0L13 43.2c-.2.2-.3.4-.5.6.7 1.3 2 2.2 3.4 2.2h32c1.5 0 2.7-.9 3.4-2.2-.1-.2-.3-.4-.5-.6z"
          />
        </g>
        <path
          className="st3"
          d="M35.5 32c-1.9-1.9-5.1-1.9-7 0L13 43.5l-.5.5c.7 1.2 2 1.9 3.4 1.9h32c1.5 0 2.7-.8 3.4-1.9-.1-.2-.3-.3-.5-.5z"
        />
        <g className="st1">
          <path
            className="st2"
            d="M12.6 20.2c.7-1.3 2-2.2 3.4-2.2h32c1.5 0 2.7.9 3.4 2.2-.1.2-.3.4-.5.6l-15.4 13c-1.9 2.1-5.1 2.1-7 0z"
          />
        </g>
        <path
          d="M28.5 32c1.9 1.9 5.1 1.9 7 0L51 20.5l.5-.5c-.7-1.2-2-1.9-3.4-1.9H16c-1.5 0-2.7.8-3.4 1.9.1.2.3.3.5.5z"
          style={{
            fill: "#fff",
          }}
        />
      </g>
      <g id="Layer_2" />
    </g>
  </svg>
);
export default Mail;
