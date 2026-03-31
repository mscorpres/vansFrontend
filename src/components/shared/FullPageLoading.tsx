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
    <div className="fixed inset-0 z-[9] flex flex-col items-center justify-center bg-white/75">
      {/* Spinner + text only, no card/rectangle */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border-[3px] border-slate-100"
          aria-hidden
        />
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-amber-400"
          style={{ animation: "spin 0.9s linear infinite" }}
          aria-hidden
        />
        <div
          className="absolute inset-[6px] rounded-full border-[2px] border-transparent border-t-amber-500"
          style={{ animation: "spin 1.2s linear infinite reverse" }}
          aria-hidden
        />
        <span className="relative z-10 text-base font-bold tracking-widest text-amber-600">
          VANS
        </span>
      </div>
      <p className="flex items-center gap-1 text-sm font-medium text-slate-500">
        Loading
        <span className="flex gap-0.5" aria-hidden>
          <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400 [animation-delay:0ms]" />
          <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400 [animation-delay:200ms]" />
          <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400 [animation-delay:400ms]" />
        </span>
      </p>
      {isTakingLonger && (
        <p className="mt-3 max-w-[240px] text-center text-xs text-slate-400">
          Taking longer than usual, please wait…
        </p>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FullPageLoading;
