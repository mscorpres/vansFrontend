import React from "react";

const FullPageLoading = () => {
  return (
    <div className="fixed z-[9] top-0 left-0 right-0 bottom-0 bg-[#ffffffb1] flex justify-center items-center">
      <div className="shadow shadow-slate-300 rounded-md p-6 bg-white flex flex-col items-center">
      
        <div className="relative w-20 h-20 perspective-1000">
          <div
            className="absolute w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg animate-flip"
            style={{
              transformStyle: "preserve-3d",
              animation: "flip 1.5s infinite ease-in-out",
            }}
          >
           
            <div
              className="absolute w-full h-full rounded-full bg-yellow-500 flex items-center justify-center text-white text-2xl font-bold backface-hidden"
              style={{ transform: "rotateY(0deg)" }}
            >
              VANS
            </div>
          
            <div
              className="absolute w-full h-full rounded-full bg-yellow-600 flex items-center justify-center text-white text-2xl font-bold backface-hidden"
              style={{ transform: "rotateY(180deg)" }}
            >
              VANS
            </div>
          </div>
        </div>
     
        <div className="text-slate-600 text-lg mt-4 font-mono tracking-wide">
          Powering Up...
        </div>
      </div>

      {/* Custom CSS Animation */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        @keyframes flip {
          0% {
            transform: rotateY(0deg) translateZ(0);
          }
          50% {
            transform: rotateY(180deg) translateZ(10px);
          }
          100% {
            transform: rotateY(360deg) translateZ(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FullPageLoading;