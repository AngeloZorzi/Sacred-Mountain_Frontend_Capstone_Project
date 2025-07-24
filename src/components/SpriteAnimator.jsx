import React, { useEffect, useState } from "react";
import "../assets/css/sceneanimation.css";

function SpriteAnimator({
  spriteUrl,
  columns = 16,
  fps = 2,
  stopAfter = null,
  reverse = false,
}) {
  const frameWidth = 341;
  const frameHeight = 341;

  const loopStart = 0;
  const loopEnd = 9;
  const finalStart = 10;
  const finalEnd = columns - 1;

  const [frame, setFrame] = useState(loopStart);
  const [phase, setPhase] = useState("loop");

  useEffect(() => {
    if (!stopAfter) return;

    const timer = setTimeout(() => {
      setPhase("final");
      setFrame(finalStart);
    }, stopAfter * 1000);

    return () => clearTimeout(timer);
  }, [stopAfter]);

  useEffect(() => {
    if (phase === "stopped") return;

    const interval = setInterval(() => {
      setFrame((prev) => {
        if (phase === "loop") {
          return prev < loopEnd ? prev + 1 : loopStart;
        }

        if (phase === "final") {
          if (prev < finalEnd) {
            return prev + 1;
          } else {
            setPhase("stopped");
            return finalEnd;
          }
        }

        return prev;
      });
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [fps, phase]);

  const offsetX = reverse
    ? frameWidth * (columns - 1 - frame)
    : frameWidth * frame;
  const backgroundPosition = `-${offsetX}px 0`;

  return (
    <div
      className="sprite-container"
      style={{
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        backgroundImage: `url(${spriteUrl})`,
        backgroundPosition,
      }}
    />
  );
}

export default SpriteAnimator;
