import React, { useState, useEffect } from "react";

const FullPageLoading = () => {
  const [isTakingLonger, setIsTakingLonger] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTakingLonger(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed z-[9] top-0 left-0 right-0 bottom-0 bg-white flex justify-center items-center flex-col font-mono">
      {/* Blinking loading text */}
      <div className="text-gray-800 text-3xl font-mono tracking-wider animate-blink">
        LOADING IMS...
      </div>
      {isTakingLonger && (
        <div className="text-gray-600 text-sm mt-4 font-mono tracking-wide">
          PLEASE WAIT...
        </div>
      )}

      {/* Custom CSS Animation */}
      <style jsx>{`
        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default FullPageLoading;