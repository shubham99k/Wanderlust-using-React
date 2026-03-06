import { useEffect } from "react";
import { useApp } from "../../context/AppContext";
import "./Flash.css";

export default function Flash() {
  const { flash, clearFlash } = useApp();

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(clearFlash, 4500);
    return () => clearTimeout(t);
  }, [flash, clearFlash]);

  if (!flash) return null;

  return (
    <div className={`flash flash--${flash.type}`} role="alert">
      <span className="flash__icon">
        {flash.type === "success" ? "✓" : "✕"}
      </span>
      <span className="flash__msg">{flash.message}</span>
      <button
        className="flash__close"
        onClick={clearFlash}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
