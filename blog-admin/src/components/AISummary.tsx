'use client';

import { useState } from 'react';
import { Eye, Sparkles, Loader2, Quote } from 'lucide-react';

interface KeyMoment {
  id: number;
  title: string;
  description: string;
}

interface AISummaryData {
  quote: string;
  keyMoments: KeyMoment[];
}

interface AISummaryProps {
  postId: string;
  initialSummary?: AISummaryData | null;
}

export default function AISummary({ postId, initialSummary = null }: AISummaryProps) {
  const [summary, setSummary] = useState<AISummaryData | null>(initialSummary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/posts/${postId}/ai-summary`, {
        method: 'POST',
      });
      const resData = await response.json();
      if (resData.success) {
        setSummary(resData.data);
      } else {
        setError(resData.error || 'Failed to generate AI summary.');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '32px 0', clear: 'both' }}>
      {/* ── BANNER (Shown if summary not generated yet) ── */}
      {!summary && !loading && (
        <div
          style={{
            background: 'linear-gradient(135deg, #0d2e4e 0%, #173d63 100%)',
            padding: '16px 28px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
            boxShadow: '0 4px 20px rgba(13, 46, 78, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ff7c47',
                flexShrink: 0,
              }}
            >
              <Sparkles size={18} />
            </div>
            <h3 style={{ margin: 0, color: '#ffffff', fontSize: '18px', fontWeight: 700, whiteSpace: 'nowrap' }}>
              Looking for a Shorter Overview?
            </h3>
          </div>
          <button
            onClick={generateSummary}
            style={{
              background: '#c8420a',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(200, 66, 10, 0.25)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e04d10';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#c8420a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Sparkles size={16} /> Generate AI Summary
          </button>
        </div>
      )}

      {/* ── LOADING STATE (Pulse / Shimmer) ── */}
      {loading && (
        <div
          style={{
            background: '#f8fafc',
            border: '1.5px dashed rgba(13, 46, 78, 0.15)',
            padding: '32px',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            textAlign: 'center',
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        >
          <Loader2 className="ai-loading-spinner" size={32} style={{ color: '#0d2e4e' }} />
          <div>
            <h4 style={{ margin: 0, color: '#0d2e4e', fontWeight: 700 }}>AI is reading this article...</h4>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>Extracting core lessons and key trading moments.</p>
          </div>
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .ai-loading-spinner {
              animation: spin 1s linear infinite;
            }
          `}</style>
        </div>
      )}

      {/* ── ERROR STATE ── */}
      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            padding: '16px 20px',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <span><strong>Error:</strong> {error}</span>
          <button
            onClick={generateSummary}
            style={{
              background: 'white',
              border: '1px solid #fecaca',
              padding: '6px 12px',
              borderRadius: '6px',
              color: '#ef4444',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── GENERATED AI SUMMARY CONTENT ── */}
      {summary && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Quote Section */}
          <div style={{ position: 'relative', margin: '0 0 24px 0' }}>
            <p
              style={{
                fontSize: '18px',
                lineHeight: '1.8',
                color: '#334155',
                margin: '0 0 8px 0',
              }}
            >
              {summary.quote}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                fontSize: '11px',
                fontWeight: 700,
                color: '#94a3b8',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              ✦ AI-generated Summary
            </div>
          </div>

          {/* Key Moments */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '32px 40px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              position: 'relative',
              display: 'flex',
              gap: '24px',
            }}
          >
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#0d2e4e',
                  margin: '0 0 24px 0',
                  letterSpacing: '-0.3px',
                }}
              >
                Key Moments
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {summary.keyMoments.map((moment, idx) => (
                  <div
                    key={moment.id || idx}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#0d2e4e',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: '2px',
                        boxShadow: '0 2px 6px rgba(13,46,78,0.2)',
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h5
                        style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#0d2e4e',
                          lineHeight: '1.4',
                        }}
                      >
                        {moment.title}
                      </h5>
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '14px',
                          color: '#64748b',
                          lineHeight: '1.6',
                        }}
                      >
                        {moment.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical AI-Generated Badge on the side */}
            <div
              style={{
                width: '24px',
                borderLeft: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginLeft: '12px',
              }}
            >
              <div
                style={{
                  writingMode: 'vertical-rl',
                  textTransform: 'uppercase',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#94a3b8',
                  letterSpacing: '2px',
                  userSelect: 'none',
                  transform: 'rotate(180deg)',
                  whiteSpace: 'nowrap',
                }}
              >
                ✦ AI-generated
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
