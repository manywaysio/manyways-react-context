import * as React from "react";
const Hamburger = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      fill="currentColor"
      d="M21 12a.75.75 0 0 1-.75.75H3.75a.75.75 0 1 1 0-1.5h16.5A.75.75 0 0 1 21 12ZM3.75 6.75h16.5a.75.75 0 1 0 0-1.5H3.75a.75.75 0 0 0 0 1.5Zm16.5 10.5H3.75a.75.75 0 1 0 0 1.5h16.5a.75.75 0 1 0 0-1.5Z"
    />
  </svg>
);
export default Hamburger;
