import { twMerge } from "tailwind-merge";

interface RetroButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
  }
  
export  const RetroButton: React.FC<RetroButtonProps> = ({ text, onClick, className }) => {
    return (
      <button
        onClick={onClick}
        className={twMerge("bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-50 transition-all duration-150", className )}
      >
        {text}
      </button>
    );
  };
  
  export default RetroButton;
  