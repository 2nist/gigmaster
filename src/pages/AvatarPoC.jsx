import React, { useMemo, useState } from 'react';
import PhaserAvatar from '../components/PhaserAvatar.jsx';
import { AvatarDisplay } from '../components/AvatarDisplay.jsx';
import { EnhancedAvatar } from '../components/EnhancedBandFormation/EnhancedAvatar.jsx';

export default function AvatarPoC() {
  const [dataUrl, setDataUrl] = useState(null);
  const [seed, setSeed] = useState('poc-seed-1');
  const [lightingPreset, setLightingPreset] = useState('stage');
  const [applyTint, setApplyTint] = useState(true);
  const [debugSelection, setDebugSelection] = useState(false);
  const [ambientColorHex, setAmbientColorHex] = useState('');
  const [selection, setSelection] = useState(null);

  const ambientColorValue = useMemo(() => {
    if (!ambientColorHex || ambientColorHex.trim() === '') return null;
    const cleaned = ambientColorHex.trim().replace('#', '');
    const parsed = parseInt(cleaned, 16);
    return Number.isNaN(parsed) ? null : parsed;
  }, [ambientColorHex]);

  const presets = ['stage', 'studio', 'noir', 'none'];

  return (
    <div style={{ padding: 20 }}>
      <h2>Phaser Avatar PoC</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', maxWidth: 720 }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14 }}>
          Seed
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            style={{ padding: 4, fontSize: 14 }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14 }}>
          Lighting Preset
          <select
            value={lightingPreset}
            onChange={(e) => setLightingPreset(e.target.value)}
            style={{ padding: 4, fontSize: 14 }}
          >
            {presets.map((preset) => (
              <option key={preset} value={preset}>{preset}</option>
            ))}
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={applyTint}
            onChange={(e) => setApplyTint(e.target.checked)}
          />
          Apply tone tint
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={debugSelection}
            onChange={(e) => setDebugSelection(e.target.checked)}
          />
          Debug selection to console
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14 }}>
          Ambient Override
          <input
            type="color"
            value={ambientColorHex || '#000000'}
            onChange={(e) => setAmbientColorHex(e.target.value)}
            onBlur={(e) => {
              if (!e.target.value) setAmbientColorHex('');
            }}
            style={{ width: 40, height: 32, padding: 0, border: 'none' }}
          />
          <button
            type="button"
            onClick={() => setAmbientColorHex('')}
            style={{ marginTop: 4, fontSize: 12 }}
          >
            Clear
          </button>
        </label>
      </div>
      <div style={{ display: 'flex', gap: 20 }}>
        <div>
          <PhaserAvatar
            seed={seed}
            archetype="guitarist"
            size={256}
            lightingPreset={lightingPreset}
            applyTint={applyTint}
            ambientColor={ambientColorValue}
            debugSelection={debugSelection}
            onGenerated={(url) => setDataUrl(url)}
            onSelection={(payload) => setSelection(payload)}
          />
        </div>
        <div>
          <h3>Snapshot</h3>
          {dataUrl ? (
            <img src={dataUrl} alt="Generated avatar" style={{ width: 256, height: 256 }} />
          ) : (
            <div style={{ width: 256, height: 256, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Waiting...</div>
          )}
          {selection ? (
            <div style={{ marginTop: 12 }}>
              <h4 style={{ margin: '4px 0' }}>Selected Features</h4>
              <div style={{ maxHeight: 180, overflow: 'auto', fontSize: 12, border: '1px solid #ddd', padding: 8, borderRadius: 4, background: '#fafafa' }}>
                {selection.features.map((feat) => (
                  <div key={`${feat.layer}-${feat.id}`} style={{ marginBottom: 6 }}>
                    <strong>{feat.layer}</strong>: {feat.id}
                    {feat.tone ? ` • tone ${feat.tone}` : ''}
                    {feat.styleTags?.length ? ` • styles ${feat.styleTags.join(', ')}` : ''}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <h3>AvatarDisplay (feature-flagged)</h3>
      <AvatarDisplay seed="poc-seed-1" size={256} />

      <h3>EnhancedAvatar (feature-flagged)</h3>
      <EnhancedAvatar traits={{ role: 'guitarist' }} size="medium" />
    </div>
  );
}
