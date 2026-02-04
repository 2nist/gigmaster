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
  baseUrl = null,
  preserveDrawingBuffer = false,
  onGenerated,
  onSelection
}) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  // keep latest callbacks in refs so event handlers remain stable
  const onGeneratedRef = useRef(onGenerated);
  const onSelectionRef = useRef(onSelection);
  useEffect(() => { onGeneratedRef.current = onGenerated; }, [onGenerated]);
  useEffect(() => { onSelectionRef.current = onSelection; }, [onSelection]);

  // Create the Phaser game once on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: size,
      height: size,
      backgroundColor: 0xffffff,
      scene: AvatarScene,
      scale: { mode: Phaser.Scale.NONE },
      render: { antialias: true, preserveDrawingBuffer: Boolean(preserveDrawingBuffer) },
      resolution: (typeof window !== 'undefined' && window.devicePixelRatio) ? Math.min(window.devicePixelRatio, 2) : 1
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // stable event handlers that dispatch to latest refs
    const generatedHandler = (dataUrl) => {
      try { console.log('[PhaserAvatar] avatar:generated received', { len: dataUrl ? dataUrl.length : 0 }); } catch (e) {}
      onGeneratedRef.current?.(dataUrl);
    };

    const selectionHandler = (payload) => {
      try { console.log('[PhaserAvatar] avatar:selection received', { features: payload?.features?.length }); } catch (e) {}
      onSelectionRef.current?.(payload);
    };

    if (game && game.events && game.events.on) {
      console.log('[PhaserAvatar] registering event listeners');
      game.events.on('avatar:generated', generatedHandler);
      game.events.on('avatar:selection', selectionHandler);
    }

    // If caller provided a baseUrl, make it available for the scene via the same global the scene reads
    if (typeof window !== 'undefined' && baseUrl) {
      try { window.__BASE_URL__ = baseUrl; } catch (e) { /* ignore */ }
    }

    // Start the scene with initial data
    try {
      console.log('[PhaserAvatar] starting AvatarScene', { seed, archetype, size, lightingPreset, applyTint, ambientColor, debugSelection, baseUrl, preserveDrawingBuffer });
      // Ensure previous instance is stopped to avoid lifecycle overlap
      try { if (game.scene.isActive && game.scene.isActive('AvatarScene')) game.scene.stop('AvatarScene'); } catch (e) {}
      game.scene.start('AvatarScene', {
        seed,
        archetype,
        size,
        lightingPreset,
        applyTint,
        ambientColor,
        debugSelection,
        baseUrl
      });

      // Deliver any immediate snapshot flags that the scene might have emitted
      setTimeout(() => {
        try {
          if (typeof window !== 'undefined') {
            if (window.__rt_snapshot_src) {
              console.log('[PhaserAvatar] found window.__rt_snapshot_src, delivering to onGenerated');
              onGeneratedRef.current?.(window.__rt_snapshot_src);
            }
            if (window.__rt_snapshot_immediate_src) {
              console.log('[PhaserAvatar] found window.__rt_snapshot_immediate_src, delivering to onGenerated');
              onGeneratedRef.current?.(window.__rt_snapshot_immediate_src);
            }
          }
        } catch (err) {
          console.warn('[PhaserAvatar] error checking window flags', err && err.message);
        }
      }, 50);
    } catch (e) {
      console.warn('[PhaserAvatar] scene.start threw', e && e.message);
    }

    return () => {
      if (game && game.events && game.events.off) {
        game.events.off('avatar:generated', generatedHandler);
        game.events.off('avatar:selection', selectionHandler);
      }
      try { game.destroy(true); } catch (e) {}
      gameRef.current = null;
    };
  }, []);

  // When props change, start the scene with new initialization data instead of destroying the whole game
  useEffect(() => {
    const game = gameRef.current;
    if (!game) return;

    try {
      console.log('[PhaserAvatar] updating AvatarScene', { seed, archetype, size, lightingPreset, applyTint, ambientColor, debugSelection });
      game.scene.start('AvatarScene', {
        seed,
        archetype,
        size,
        lightingPreset,
        applyTint,
        ambientColor,
        debugSelection
      });

      // Deliver any immediate snapshot flags shortly after starting
      setTimeout(() => {
        try {
          if (typeof window !== 'undefined') {
            if (window.__rt_snapshot_src) onGeneratedRef.current?.(window.__rt_snapshot_src);
            if (window.__rt_snapshot_immediate_src) onGeneratedRef.current?.(window.__rt_snapshot_immediate_src);
          }
        } catch (err) { /* ignore */ }
      }, 50);
    } catch (e) {
      console.warn('[PhaserAvatar] update scene.start threw', e && e.message);
    }
  }, [seed, archetype, size, lightingPreset, applyTint, ambientColor, debugSelection]);

  return <div ref={containerRef} style={{ width: size, height: size }} />;
}
