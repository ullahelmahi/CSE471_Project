import { useEffect, useState } from "react";

const ExpandableMap = ({ children, height = "200px" }) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  }, [expanded]);

  return (
    <>
      {/* SMALL VIEW */}
      {!expanded && (
        <div
          className="relative rounded overflow-hidden"
          style={{ height }}
        >
          {/* MAP */}
          <div className="w-full h-full relative z-10">
            {children}
          </div>

          {/* EXPAND BUTTON – OUTSIDE MAP LAYERS */}
          <div className="absolute top-2 right-2 z-[9999] pointer-events-auto">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="btn btn-xs btn-neutral"
            >
              ⛶
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN */}
      {expanded && (
        <div className="fixed inset-0 z-[9999] bg-black">
          <button
            className="absolute top-4 right-4 btn btn-sm btn-error z-[10000]"
            onClick={() => setExpanded(false)}
          >
            ✕ Close
          </button>

          <div className="flex-1 w-full h-full">
            <div className="w-full h-full">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpandableMap;