import { useState } from "react";

export const SingleCom = ({image, heading, onSlideClick}) => {

  return (
    <div className="mt-30">
      <div className="relative flex items-center justify-center md:mt-10 px-4 text-3xl md:text-4xl lg:text-5xl text-center before:content-[''] before:absolute before:left-0 before:w-16 md:before:w-40 lg:before:w-70 before:h-[1px] before:bg-gray-500 before:top-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:right-0 after:w-16 md:after:w-40 lg:after:w-70 after:h-[1px] after:bg-gray-500 after:top-1/2 after:-translate-y-1/2 mt-6">
      {heading}
      </div>

      <div className="w-auto my-10 cursor-pointer">
        <img src={image} alt={heading} loading="lazy" onClick={onSlideClick} />
      </div>
    </div>
  );
};