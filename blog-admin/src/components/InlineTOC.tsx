'use client';

import { useState, useEffect, useRef } from 'react';

interface HeadingItem {
  text: string;
  id: string;
  level: number;
}

interface InlineTOCProps {
  headings: HeadingItem[];
}

export default function InlineTOC({ headings }: InlineTOCProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id || '');
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLButtonElement | null>(null);

  // Scroll spy: highlight the heading currently in view
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id));
      let currentActiveId = headings[0].id;

      for (const el of headingElements) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 180) {
          currentActiveId = el.id;
        } else {
          break;
        }
      }
      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // Auto-scroll the TOC bar to keep the active tab visible
  useEffect(() => {
    if (activeLinkRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeLinkRef.current;
      const elLeft = el.offsetLeft;
      const elRight = elLeft + el.offsetWidth;
      const containerLeft = container.scrollLeft;
      const containerRight = containerLeft + container.offsetWidth;

      if (elLeft < containerLeft) {
        container.scrollTo({ left: elLeft - 16, behavior: 'smooth' });
      } else if (elRight > containerRight) {
        container.scrollTo({ left: elRight - container.offsetWidth + 16, behavior: 'smooth' });
      }
    }
  }, [activeId]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 150;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  // Only show H2-level headings in the inline TOC to keep it concise
  const tocItems = headings.filter(h => h.level <= 3);

  return (
    <div className="inline-toc-wrapper">
      <div className="inline-toc-label">On this page</div>
      <div className="inline-toc-scroll" ref={scrollRef}>
        {tocItems.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <button
              key={heading.id}
              ref={isActive ? activeLinkRef : null}
              onClick={(e) => handleClick(e, heading.id)}
              className={`inline-toc-item ${isActive ? 'is-active' : ''}`}
              style={{ paddingLeft: heading.level === 3 ? '12px' : undefined }}
            >
              {heading.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
