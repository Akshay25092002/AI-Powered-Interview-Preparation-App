import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import React from "react";

const LoaderPage = ({ className }) => {
  // here this className is optional if there any extra style
  return (
    <div
      className={cn(
        "w-screen h-screen flex items-center justify-center bg-transparent z-50",
        className
      )}
    >
      <Loader className="w-6 h-6 min-w-6 min-h-6 animate-spin" />
    </div>
  );
};

export default LoaderPage;
