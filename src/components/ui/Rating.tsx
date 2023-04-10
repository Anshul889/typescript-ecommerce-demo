import React from "react";
import NextImage from "next/image";
import  StarIcon from "../../../public/star-solid.svg";

type Props = {
  rating: number;
};

const Rating = ({ rating }: Props) => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<div key={i} className="relative h-4 w-4"><NextImage src={StarIcon as string} fill alt=''/></div>);
  }
  return <div className="grid grid-cols-[repeat(5,max-content)]">{stars.map((star) => star)}</div>;
};

export default Rating;
