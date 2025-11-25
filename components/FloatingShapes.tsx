import React from "react";

const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Circle 1 - Top Left */}
      {/* <div className="absolute top-20 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div> */}

      {/* Circle 2 - Top Right */}
      <div className="absolute top-20 right-4 w-48 h-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* Circle 3 - Bottom Left */}
      {/* <div className="absolute -bottom-8 left-20 w-48 h-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div> */}

      {/* Additional decorative shapes */}
      <div className="absolute -bottom-4 left-10 w-12 h-12 border-4 border-blue-400/30 rounded-lg rotate-12 animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-10 w-16 h-16 border-4 border-emerald-400/30 rounded-full animate-float-slower"></div>
      <div className="absolute top-20 -left-4 w-8 h-8 bg-orange-400/20 rotate-45 animate-float"></div>
    </div>
  );
};

export default FloatingShapes;
