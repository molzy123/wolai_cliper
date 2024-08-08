import React, { useState } from "react";

function CircleButton({ onClick }) {
  const [closeHover, setCloseHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setCloseHover(true)}
      onMouseLeave={() => setCloseHover(false)}
      className="relative size-4 p-[1px] inline-flex items-center justify-center rounded-full text-white bg-red-500 hover:bg-red-600 outline-black"
    >
      <div
        className={`${
          closeHover ? "" : "hidden"
        } flex items-center justify-center size-4 font-bold`}
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </button>
  );
}

export default CircleButton;
