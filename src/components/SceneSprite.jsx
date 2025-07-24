import React from "react";
import SpriteAnimator from "./SpriteAnimator";
import "../assets/css/sceneanimation.css";

/* All credits for the initial images goes to: OpenGameArt, Reddit r/PixelArt, Google images
  All animations and sprites made by me with Piskel*/

const spriteSettings = {
  1: { url: "/sprites/scene1.png", columns: 16, reverse: false, stopAfter: 30 },
  2: { url: "/sprites/scene3.png", columns: 16, reverse: false },
  3: { url: "/sprites/scene3.png", columns: 16, reverse: false },
  6: { url: "/sprites/scene2.png", columns: 16, reverse: false },
  7: { url: "/sprites/scene4.png", columns: 16, reverse: false },
  12: { url: "/sprites/scenetemple.png", columns: 16, reverse: false },
  9: { url: "/sprites/scenetemple.png", columns: 16, reverse: false },
  24: { url: "/sprites/maskscene.png", columns: 16, reverse: false },
  16: { url: "/sprites/scenefonte.png", columns: 16, reverse: false },
  8: { url: "/sprites/ravenscene.png", columns: 16, reverse: false },
  13: { url: "/sprites/templeinside.png", columns: 16, reverse: false },
};

function SceneSprite({ sceneId }) {
  const config = spriteSettings[sceneId];
  if (!config) return null;

  return (
    <SpriteAnimator
      spriteUrl={config.url}
      columns={config.columns || 16}
      reverse={config.reverse || false}
      stopAfter={config.stopAfter || null}
    />
  );
}

export default SceneSprite;
