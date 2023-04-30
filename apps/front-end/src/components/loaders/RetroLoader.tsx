import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface RetroLoaderProps {
  loadingText: string;
  duration: number;
  className?: string;
}

const RetroLoader: React.FC<RetroLoaderProps> = ({
  loadingText,
  duration,
  className,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 1);
    }, duration / 100);

    if (progress >= 100) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [progress, duration]);

  return (
    <div
      className={twMerge(
        "flex flex-col items-center retro-loader-font",
        className
      )}
      style={{
        fontFamily: "Press Start 2P, cursive",
        fontSize: "1.5rem",
      }}
    >
      <div className="mb-4">{loadingText}</div>
      <div className="relative w-full h-8 bg-gray-300 border-2 border-black">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 transition-width duration-500 ease-in"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RetroLoader;
