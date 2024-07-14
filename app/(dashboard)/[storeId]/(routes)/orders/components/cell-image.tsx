"use client";

import Image from "next/image";

interface CellImageProps {
  data: string[];
}

const CellImage = ({ data }: CellImageProps) => {
  return (
    <>
      {data.map((url, index) => (
        <div
          key={index}
          className="overflow-hidden w-16 h-16 min-h-16 min-w-16 aspect-square rounded-md flex items-center justify-center relative"
        >
          <Image 
            alt="Order Image" 
            fill 
            className="object-contain" 
            src={url} 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust sizes based on your layout
          />
        </div>
      ))}
    </>
  );
};

export default CellImage;
