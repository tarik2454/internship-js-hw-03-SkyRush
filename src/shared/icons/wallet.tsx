export function Timer() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25.5"
      height="26.333"
      fill="none"
      viewBox="0 0 25.5 26.334"
    >
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M2.333 0h20v20h-20z" />
        </clipPath>
        <filter
          id="b"
          width="25.5"
          height="26.333"
          x="0"
          y="0"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="4" in="hardAlpha" />
          <feGaussianBlur stdDeviation="1.333" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend in2="BackgroundImageFix" result="effect_dropShadow_1" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="4" in="hardAlpha" />
          <feGaussianBlur stdDeviation="1.333" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend in2="effect_dropShadow_1" result="effect_dropShadow_2" />
          <feBlend
            in="SourceGraphic"
            in2="effect_dropShadow_2"
            result="shape"
          />
        </filter>
      </defs>
      <g clip-path="url(#a)" filter="url(#b)">
        <path d="M2.333 0h20v20h-20z" />
        <path
          stroke="#00d492"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.667"
          d="M18.167 5.833v-2.5a.833.833 0 0 0-.834-.833H6.5a1.667 1.667 0 1 0 0 3.333H19a.833.833 0 0 1 .833.834V10m-2.5 0a1.667 1.667 0 1 0 0 3.333h2.5a.834.834 0 0 0 .834-.833v-1.667a.833.833 0 0 0-.834-.833z"
        />
        <path
          stroke="#00d492"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.667"
          d="M4.833 4.167v11.666A1.667 1.667 0 0 0 6.5 17.5H19a.833.833 0 0 0 .833-.833v-3.334"
        />
      </g>
    </svg>
  );
}
