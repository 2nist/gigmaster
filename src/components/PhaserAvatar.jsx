import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import AvatarScene from '../avatar/phaser/AvatarScene';

export default function PhaserAvatar({
  seed,
  archetype,
  size = 512,
  lightingPreset = 'stage',
  applyTint = true,
  ambientColor = null,
  debugSelection = false,
  onGenerated,
  onSelection
}) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy previous game if present
    if (gameRef.current) {
      try { gameRef.current.destroy(true); } catch (e) {}
      gameRef.current = null;
    }

    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: size,
      height: size,
      backgroundColor: 0xffffff,
      scene: AvatarScene,
      scale: { mode: Phaser.Scale.NONE }
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Listen for avatar-generated events emitted by the scene
    const onGeneratedHandler = (dataUrl) => {
      onGenerated?.(dataUrl);
    };

    const onSelectionHandler = (payload) => {
      onSelection?.(payload);
    };

    // Listen globally on game.events
    if (game && game.events && game.events.on) {
      game.events.on('avatar:generated', onGeneratedHandler);
      game.events.on('avatar:selection', onSelectionHandler);
    }

    // Start scene with initial data (init() receives it)
    try {
      game.scene.start('AvatarScene', {
        seed,
        archetype,
        size,
        lightingPreset,
        applyTint,
        ambientColor,
        debugSelection
      });
    } catch (e) {
      // scene may start automatically; ignore
    }

    return () => {
      if (game && game.events && game.events.off) {
        game.events.off('avatar:generated', onGeneratedHandler);
        game.events.off('avatar:selection', onSelectionHandler);
      }
      try { game.destroy(true); } catch (e) {}
      gameRef.current = null;
    };
  }, [seed, archetype, size, lightingPreset, applyTint, ambientColor, debugSelection, onGenerated, onSelection]);

  return <div ref={containerRef} style={{ width: size, height: size }} />;
}
