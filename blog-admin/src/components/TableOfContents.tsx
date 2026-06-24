'use client';

import { useState, useEffect } from 'react';

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
        if (rect.top <= 160) {
          currentActiveId = el.id;
        } else {
          break;
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      } else {
        setActiveId(headings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <aside className={`toc-sidebar ${isOpen ? 'is-open' : 'is-closed'}`}>
      {/* Header: label + toggle */}
      <div className="toc-header">
        {isOpen && <span className="toc-title">Table of contents</span>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="toc-toggle-btn"
          title={isOpen ? 'Collapse' : 'Expand table of contents'}
          aria-label={isOpen ? 'Collapse' : 'Expand'}
        >
          {isOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </button>
      </div>

      {/* Heading list */}
      {isOpen && (
        <nav className="toc-nav">
          {headings.map((heading) => {
            const isActive = heading.id === activeId;
            // Indent H3 and H4 relative to H2
            const indent = Math.max(0, (heading.level - 2) * 14);

            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => handleLinkClick(e, heading.id)}
                className={`toc-link ${isActive ? 'is-active' : ''}`}
                style={{ paddingLeft: `${indent + 16}px` }}
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
