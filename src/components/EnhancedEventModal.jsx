import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Heart, Skull, AlertTriangle } from 'lucide-react';

/**
 * EnhancedEventModal - Cinematic presentation of gritty, mature events
 * 
 * Features:
 * - Atmospheric rendering
 * - Character dialogue
 * - Risk/consequence preview
 * - Psychological state visualization
 * - Real-time consequence estimation
 */
export const EnhancedEventModal = ({ 
  isOpen, 
  event, 
  psychologicalState,
  onChoice,
  onClose 
}) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showConsequences, setShowConsequences] = useState(false);
  const [hoverChoice, setHoverChoice] = useState(null);

  if (!isOpen || !event) return null;

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'text-secondary';
      case 'medium': return 'text-accent';
      case 'high': return 'text-orange-500';
      case 'extreme': return 'text-destructive';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskBgColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'border-secondary';
      case 'medium': return 'border-accent';
      case 'high': return 'border-orange-500';
      case 'extreme': return 'border-destructive';
      case 'critical': return 'border-destructive';
      default: return 'border-border';
    }
  };

  const getRiskEmoji = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return '✓';
      case 'medium': return '⚠';
      case 'high': return '⚠⚠';
      case 'extreme': return '☠';
      case 'critical': return '💀';
      default: return '?';
    }
  };

  const formatConsequence = (label, value) => {
    if (value === 0) return null;
    const isPositive = value > 0;
    const symbol = isPositive ? '+' : '';
    const className = isPositive ? 'text-secondary' : 'text-destructive';
    return (
      <div key={label} className={`${className} text-sm mb-1`}>
        {symbol}{value} {label}
      </div>
    );
  };

  const calculateImpact = (choice) => {
    const impacts = {
      immediate: [],
      longTerm: [],
      psychological: []
    };

    if (choice.immediateEffects) {
      Object.entries(choice.immediateEffects).forEach(([key, value]) => {
        impacts.immediate.push(formatConsequence(key, value));
      });
    }

    if (choice.psychologicalEffects) {
      Object.entries(choice.psychologicalEffects).forEach(([key, value]) => {
        impacts.psychological.push(formatConsequence(key, value));
      });
    }

    if (choice.longTermEffects) {
      impacts.longTerm.push(
        <div key="long-term" style={{ color: '#a78bfa', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
          {typeof choice.longTermEffects === 'object' 
            ? Object.keys(choice.longTermEffects).join(', ')
            : 'Long-term consequences'}
        </div>
      );
    }

    return impacts;
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-1000 p-4"
      onClick={onClose}
    >
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 opacity-50 animate-pulse"
        style={{
          background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, 
            rgba(79, 70, 229, 0.1) 0%, 
            rgba(0, 0, 0, 0.9) 100%)`
        }}
      />

      {/* Modal content */}
      <div
        className={`bg-card rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto relative z-1001 border-2 ${getRiskBgColor(event.risk || 'medium')}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-background border-b-2 ${getRiskBgColor(event.risk || 'medium')} p-6 sticky top-0`}>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-4xl w-12 flex items-center justify-center">
              {getRiskEmoji(event.risk || 'medium')}
            </span>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground m-0">
                {event.title}
              </h2>
              <p className="text-muted-foreground m-0 mt-1 text-sm">
                {event.category?.replace('_', ' ')} • Risk: {event.risk?.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Character info */}
          {event.character && (
            <div className="bg-muted/30 p-3 rounded mt-3">
              <p className="text-foreground/80 m-0 italic">
                <strong className="text-foreground">{event.character.name}</strong>: {event.character.dialogue}
              </p>
            </div>
          )}
        </div>

        {/* Event description */}
        <div className="p-8 border-b border-border/20">
          <p className="text-foreground leading-relaxed text-base m-0">
            {event.description}
          </p>

          {/* Psychological state indicator */}
          {psychologicalState && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-primary/10 p-3 rounded">
                <div className="text-xs text-primary/80 uppercase mb-1">Stress Level</div>
                <div className="h-1 bg-input rounded overflow-hidden">
                  <div
                    className={psychologicalState.stress_level > 70 ? 'bg-destructive' : 'bg-orange-500'}
                    style={{ height: '100%', width: `${psychologicalState.stress_level || 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-primary/10 p-3 rounded">
                <div className="text-xs text-primary/80 uppercase mb-1">Moral Integrity</div>
                <div className="h-1 bg-input rounded overflow-hidden">
                  <div
                    className={
                      psychologicalState.moral_integrity < 40 ? 'bg-destructive' : 
                      psychologicalState.moral_integrity < 70 ? 'bg-orange-500' : 
                      'bg-secondary'
                    }
                    style={{ height: '100%', width: `${psychologicalState.moral_integrity || 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-primary/10 p-3 rounded">
                <div className="text-xs text-primary/80 uppercase mb-1">Addiction Risk</div>
                <div className="h-1 bg-input rounded overflow-hidden">
                  <div
                    className={
                      psychologicalState.addiction_risk > 70 ? 'bg-destructive' : 
                      psychologicalState.addiction_risk > 40 ? 'bg-orange-500' : 
                      'bg-accent'
                    }
                    style={{ height: '100%', width: `${psychologicalState.addiction_risk || 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-primary/10 p-3 rounded">
                <div className="text-xs text-primary/80 uppercase mb-1">Paranoia</div>
                <div className="h-1 bg-input rounded overflow-hidden">
                  <div
                    className={psychologicalState.paranoia > 70 ? 'bg-destructive' : 'bg-orange-500'}
                    style={{ height: '100%', width: `${psychologicalState.paranoia || 0}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Choices */}
        <div className="p-6">
          <h3 className="text-muted-foreground text-xs uppercase mb-4 font-semibold">
            What do you do?
          </h3>

          <div className="flex flex-col gap-4">
            {event.choices?.map((choice) => (
              <div key={choice.id} className="relative">
                <button
                  onClick={() => {
                    setSelectedChoice(choice.id);
                    setShowConsequences(true);
                  }}
                  onMouseEnter={() => setHoverChoice(choice.id)}
                  onMouseLeave={() => setHoverChoice(null)}
                  className={`w-full p-4 rounded border-2 transition-all flex items-center gap-3 text-left font-medium ${
                    selectedChoice === choice.id 
                      ? `bg-primary/20 ${getRiskBgColor(choice.riskLevel)}` 
                      : hoverChoice === choice.id 
                      ? 'bg-muted/30 border-muted-foreground/50' 
                      : 'bg-muted/10 border-border/50'
                  } text-foreground`}
                >
                  <span className="text-xl flex-shrink-0">
                    {getRiskEmoji(choice.riskLevel)}
                  </span>
                  <span className="flex-1">{choice.text}</span>
                  {selectedChoice === choice.id && <AlertTriangle size={18} className="flex-shrink-0" />}
                </button>

                {/* Consequence preview */}
                {selectedChoice === choice.id && showConsequences && (
                  <div className="mt-3 p-4 bg-background/80 border-l-4 border-accent rounded text-sm">
                    <div className="text-foreground font-bold mb-3">Consequences:</div>

                    {(() => {
                      const impacts = calculateImpact(choice);
                      return (
                        <>
                          {impacts.immediate.length > 0 && (
                            <div className="mb-3">
                              <div className="text-primary text-xs uppercase mb-1 font-semibold">
                                Immediate Effects
                              </div>
                              {impacts.immediate}
                            </div>
                          )}

                          {impacts.psychological.length > 0 && (
                            <div className="mb-3">
                              <div className="text-primary text-xs uppercase mb-1 font-semibold">
                                Psychological Impact
                              </div>
                              {impacts.psychological}
                            </div>
                          )}

                          {impacts.longTerm.length > 0 && (
                            <div className="mb-3">
                              <div className="text-primary text-xs uppercase mb-1 font-semibold">
                                Long-term Consequences
                              </div>
                              {impacts.longTerm}
                            </div>
                          )}

                          {choice.traumaRisk && (
                            <div className="mt-3 pt-3 border-t border-border/50 text-destructive/80">
                              <div className="flex items-center gap-2 mb-1 font-semibold">
                                <Skull size={14} />
                                <span>Trauma Risk: {(choice.traumaRisk.probability * 100).toFixed(0)}%</span>
                              </div>
                              <div className="text-xs text-foreground/70">
                                {choice.traumaRisk.description}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => {
                          onChoice(event.id, choice.id, choice.text, calculateImpact(choice));
                          onClose();
                        }}
                        className={`flex-1 py-2 px-3 rounded text-white font-semibold transition-opacity hover:opacity-80 ${getRiskBgColor(choice.riskLevel)} bg-accent`}
                      >
                        Confirm Choice
                      </button>
                      <button
                        onClick={() => {
                          setSelectedChoice(null);
                          setShowConsequences(false);
                        }}
                        className="px-4 py-2 bg-muted text-foreground rounded transition-opacity hover:opacity-70"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors text-2xl w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(2rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default EnhancedEventModal;
