'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

interface HeadingItem {
  text: string;
  id: string;
  level: number;
}

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState('');

  // Scroll spy to highlight active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id));
      let currentActiveId = '';

      for (const el of headingElements) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        
        // If the heading is scrolled past the top 160px of the viewport
        if (rect.top <= 160) {
          currentActiveId = el.id;
        } else {
          break; // Headings below this are further down
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      } else {
        // Fallback to first heading if scrolled to the top
        setActiveId(headings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 140; // Height of sticky navbar + top offset spacing
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <aside
      className={`toc-sidebar ${isOpen ? 'is-open' : 'is-closed'}`}
      style={{
        position: 'sticky',
        top: '140px',
        maxHeight: 'calc(100vh - 160px)',
        overflowY: 'auto',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        width: isOpen ? '280px' : '48px',
        padding: isOpen ? '24px 20px' : '8px',
        marginRight: isOpen ? '0px' : '12px',
        flexShrink: 0
      }}
    >
      {/* Header Panel */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen ? 'space-between' : 'center',
          marginBottom: isOpen ? '16px' : '0px',
          borderBottom: isOpen ? '1px solid #e2e8f0' : 'none',
          paddingBottom: isOpen ? '8px' : '0px',
          minHeight: '32px'
        }}
      >
        {isOpen && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--teal-900)',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
          >
            Table of Contents
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--teal-900)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title={isOpen ? 'Collapse Table of Contents' : 'Expand Table of Contents'}
        >
          {isOpen ? <ChevronLeft size={16} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Heading list */}
      {isOpen && (
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            overflowY: 'auto',
            paddingTop: '8px'
          }}
        >
          {headings.map((heading) => {
            const isActive = heading.id === activeId;
            // Indent based on heading level (H1/H2=0, H3=12px, H4=24px)
            const indent = Math.max(0, (heading.level - 2) * 12);

            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => handleLinkClick(e, heading.id)}
                className={`toc-link ${isActive ? 'is-active' : ''}`}
                style={{
                  display: 'block',
                  paddingLeft: `${indent + 8}px`,
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  fontSize: heading.level === 2 ? '14px' : '13px',
                  fontWeight: heading.level === 2 ? 600 : 500,
                  color: isActive ? 'var(--orange)' : 'var(--text-dim)',
                  textDecoration: 'none',
                  borderLeft: '3px solid transparent',
                  borderLeftColor: isActive ? 'var(--orange)' : 'transparent',
                  transition: 'all 0.2s ease',
                  lineHeight: '1.6',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {heading.text}
              </a>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
