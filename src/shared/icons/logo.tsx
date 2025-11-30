export function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      fill="none"
      viewBox="0 0 40 40"
    >
      <defs>
        <linearGradient
          id="a"
          x1="0"
          x2="40"
          y1="0"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#00bc7c" />
          <stop offset=".5" stop-color="#2b7fff" />
          <stop offset="1" stop-color="#980ffa" />
        </linearGradient>
        <clipPath id="b">
          <path fill="#fff" d="M8 8h24v24H8z" />
        </clipPath>
      </defs>
      <rect width="40" height="40" fill="url(#a)" rx="10" />
      <g clip-path="url(#b)">
        <path d="M8 8h24v24H8z" />
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M18 22.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 15 29.978M22 22.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 25 29.978M26 17h1.5a2.5 2.5 0 0 0 0-5H26M12 30h16"
        />
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15.757 21.243A6 6 0 0 0 26 17v-6a1 1 0 0 0-1-1H15a1 1 0 0 0-1 1v6a6 6 0 0 0 1.757 4.243"
        />
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M14 17h-1.5a2.5 2.5 0 0 1 0-5H14"
        />
      </g>
    </svg>
  );
}
