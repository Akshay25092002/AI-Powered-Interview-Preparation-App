import React from "react";

const MarqueeImg = ({ img }) => {
  return (
    <img
      src={img}
      className="w-44 h-44 xl:w-52 object-contain grayscale mx-12 xl:mx-16"
    />
  );
};

export default MarqueeImg;
