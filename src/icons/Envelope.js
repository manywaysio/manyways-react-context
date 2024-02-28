import * as React from "react";
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={17} height={16} fill="none" {...props}>
    <path
      fill="#000"
      d="M14.5 3h-12a.5.5 0 0 0-.5.5V12a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V3.5a.5.5 0 0 0-.5-.5Zm-6 5.322L3.786 4h9.428L8.5 8.322ZM6.67 8 3 11.363V4.637L6.67 8Zm.74.678.75.69a.5.5 0 0 0 .676 0l.75-.69L13.21 12H3.786l3.623-3.322ZM10.33 8 14 4.636v6.728L10.33 8Z"
    />
  </svg>
);
export default SvgComponent;
