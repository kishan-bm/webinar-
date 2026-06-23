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
        top: '120px',
        maxHeight: 'calc(100vh - 140px)',
        overflowY: 'auto',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        backgroundColor: 'transparent',
        width: isOpen ? '280px' : '48px',
        padding: isOpen ? '0 20px 0 0' : '8px',
        borderRight: isOpen ? '1px dashed #cbd5e1' : 'none',
        flexShrink: 0
      }}
    >
      {/* Header Panel */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen ? 'space-between' : 'center',
          marginBottom: isOpen ? '20px' : '0px',
          minHeight: '32px'
        }}
      >
        {isOpen && (
          <span
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#0d2e4e',
              fontFamily: "'DM Sans', sans-serif"
            }}
          >
            Table of contents
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
            gap: '16px',
            overflowY: 'auto',
            paddingTop: '4px'
          }}
        >
          {headings.map((heading) => {
            const isActive = heading.id === activeId;
            const indent = Math.max(0, (heading.level - 2) * 16);

            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => handleLinkClick(e, heading.id)}
                className={`toc-link ${isActive ? 'is-active' : ''}`}
                style={{
                  display: 'block',
                  paddingLeft: `${indent}px`,
                  fontSize: heading.level === 2 ? '14px' : '13px',
                  fontWeight: heading.level === 2 ? 600 : 500,
                  color: isActive ? '#0d2e4e' : '#64748b',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  lineHeight: '1.4',
                  whiteSpace: 'normal', // Allow wrap as in nogood
                  borderLeft: 'none' // Remove default border highlighting
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
