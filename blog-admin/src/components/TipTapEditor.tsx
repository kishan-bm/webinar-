'use client';

import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Mark, mergeAttributes, Extension, Node } from '@tiptap/core';
import { Plugin, PluginKey, NodeSelection, Selection } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Bold, Italic, Heading2, List, ListOrdered, ImageIcon, LinkIcon, Code, Edit2, Trash2, Check, X, AlignLeft, AlignCenter, AlignRight, AlignJustify, FileCode, Minus, Table as TableIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCallback, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Custom extension to highlight text selection when the editor is blurred but user is using the link menus
const BlurredSelectionHighlight = Extension.create({
  name: 'blurredSelectionHighlight',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('blurredSelectionHighlight'),
        props: {
          decorations(state) {
            const { selection } = state;
            if (!selection || selection.empty) {
              return DecorationSet.empty;
            }
            
            if (typeof document !== 'undefined') {
              const activeEl = document.activeElement;
              const isBubbleMenuFocused = activeEl && activeEl.closest('.bubble-menu');
              const isToolbarModalFocused = activeEl && activeEl.closest('.toolbar-link-modal');
              
              if (isBubbleMenuFocused || isToolbarModalFocused) {
                return DecorationSet.create(state.doc, [
                  Decoration.inline(selection.from, selection.to, {
                    class: 'blurred-selection-highlight',
                  }),
                ]);
              }
            }
            return DecorationSet.empty;
          },
        },
      }),
    ];
  },
});

// Position options: Left, Center, Right, In-Text (floats within paragraph text)
const IMAGE_POSITIONS = [
  {
    key: 'left',
    label: 'Left',
    desc: 'Block left',
    icon: (
      <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
        <rect x="1" y="1" width="11" height="9" rx="2" fill="currentColor" opacity="0.9"/>
        <rect x="1" y="13" width="24" height="2" rx="1" fill="currentColor" opacity="0.35"/>
        <rect x="1" y="17" width="18" height="2" rx="1" fill="currentColor" opacity="0.35"/>
      </svg>
    ),
  },
  {
    key: 'center',
    label: 'Center',
    desc: 'Centered block',
    icon: (
      <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
        <rect x="7" y="1" width="12" height="9" rx="2" fill="currentColor" opacity="0.9"/>
        <rect x="1" y="13" width="24" height="2" rx="1" fill="currentColor" opacity="0.35"/>
        <rect x="4" y="17" width="18" height="2" rx="1" fill="currentColor" opacity="0.35"/>
      </svg>
    ),
  },
  {
    key: 'right',
    label: 'Right',
    desc: 'Block right',
    icon: (
      <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
        <rect x="14" y="1" width="11" height="9" rx="2" fill="currentColor" opacity="0.9"/>
        <rect x="1" y="13" width="24" height="2" rx="1" fill="currentColor" opacity="0.35"/>
        <rect x="7" y="17" width="18" height="2" rx="1" fill="currentColor" opacity="0.35"/>
      </svg>
    ),
  },
  {
    key: 'in-text',
    label: 'In Text',
    desc: 'Drag to float in paragraph',
    icon: (
      <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
        <rect x="1" y="2" width="9" height="12" rx="2" fill="currentColor" opacity="0.9"/>
        <rect x="13" y="2" width="12" height="2" rx="1" fill="currentColor" opacity="0.35"/>
        <rect x="13" y="6" width="12" height="2" rx="1" fill="currentColor" opacity="0.35"/>
        <rect x="13" y="10" width="9" height="2" rx="1" fill="currentColor" opacity="0.35"/>
        <rect x="1" y="16" width="24" height="2" rx="1" fill="currentColor" opacity="0.25"/>
      </svg>
    ),
  },
];

const WIDTH_PRESETS = ['25%', '33%', '50%', '66%', '75%', '100%', 'auto'];

const FONT_SIZE_PRESETS = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '30', '36', '48', '60', '72'];

function FontSizePicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Derive numeric display from e.g. "16px" → "16"
  const numericVal = value ? value.replace('px', '') : '16';
  const isPreset = FONT_SIZE_PRESETS.includes(numericVal);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as globalThis.Node)) {
        setOpen(false);
        setCustomMode(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const applyCustom = () => {
    const parsed = parseFloat(customValue);
    if (!isNaN(parsed) && parsed > 0) {
      onChange(`${parsed}px`);
    }
    setCustomMode(false);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setCustomMode(false); }}
        className="toolbar-select"
        style={{
          width: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          gap: '4px',
          padding: '4px 8px',
          fontSize: '13px',
        }}
        title="Font Size"
      >
        <span>{numericVal}</span>
        <span style={{ fontSize: '9px', opacity: 0.6 }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          zIndex: 999,
          width: '120px',
          overflow: 'hidden',
        }}>
          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {FONT_SIZE_PRESETS.map(size => (
              <div
                key={size}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(`${size}px`);
                  setOpen(false);
                  setCustomMode(false);
                }}
                style={{
                  padding: '7px 14px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  background: numericVal === size ? 'var(--accent-color, #c8420a)' : 'transparent',
                  color: numericVal === size ? 'white' : 'var(--text-main)',
                  fontWeight: numericVal === size ? 600 : 400,
                }}
                onMouseEnter={e => { if (numericVal !== size) (e.currentTarget as HTMLDivElement).style.background = '#f3f4f6'; }}
                onMouseLeave={e => { if (numericVal !== size) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                {size}
              </div>
            ))}
          </div>
          {/* Custom option */}
          <div style={{ borderTop: '1px solid var(--border-color)' }}>
            {customMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 8px' }}>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="400"
                  autoFocus
                  value={customValue}
                  onChange={e => setCustomValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') applyCustom();
                    if (e.key === 'Escape') { setCustomMode(false); setOpen(false); }
                  }}
                  placeholder="e.g. 13.5"
                  style={{
                    width: '64px',
                    padding: '4px 6px',
                    fontSize: '12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onMouseDown={e => { e.preventDefault(); applyCustom(); }}
                  style={{
                    background: 'var(--accent-color, #c8420a)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  ✓
                </button>
              </div>
            ) : (
              <div
                onMouseDown={e => { e.preventDefault(); setCustomMode(true); setCustomValue(isPreset ? numericVal : ''); }}
                style={{
                  padding: '7px 14px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: 'var(--accent-color, #c8420a)',
                  fontWeight: 600,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#fff5f0'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                Custom…
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// React NodeView component for resizable images with drag handle
function ResizableImageNodeView({ node, updateAttributes, selected }: any) {
  const { src, alt, title, href, width, align } = node.attrs;
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const imgRef = useRef<HTMLImageElement>(null);
  // For in-text mode: track drag direction to auto-set float side
  const floatDragStartX = useRef(0);

  const imgAlign = align || 'center';
  const isInText = imgAlign === 'in-text' || imgAlign === 'float-left' || imgAlign === 'float-right';
  // Resolve actual float side for in-text mode
  const floatSide: 'left' | 'right' | null = 
    imgAlign === 'in-text' || imgAlign === 'float-left' ? 'left' :
    imgAlign === 'float-right' ? 'right' : null;

  // Compute wrapper style
  const getWrapperStyle = (): React.CSSProperties => {
    if (floatSide === 'left') return { float: 'left', marginRight: '20px', marginBottom: '12px', marginTop: '4px', display: 'inline-block' };
    if (floatSide === 'right') return { float: 'right', marginLeft: '20px', marginBottom: '12px', marginTop: '4px', display: 'inline-block' };
    if (imgAlign === 'left') return { marginLeft: '0', marginRight: 'auto', marginTop: '12px', marginBottom: '4px' };
    if (imgAlign === 'right') return { marginLeft: 'auto', marginRight: '0', marginTop: '12px', marginBottom: '4px' };
    return { marginLeft: 'auto', marginRight: 'auto', marginTop: '12px', marginBottom: '4px' };
  };

  // Resize drag (right handle)
  const onMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imgRef.current) return;
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = imgRef.current.offsetWidth;

    const onMouseMove = (mv: MouseEvent) => {
      const newW = Math.max(80, startWidthRef.current + mv.clientX - startXRef.current);
      if (imgRef.current) imgRef.current.style.width = `${newW}px`;
    };
    const onMouseUp = (up: MouseEvent) => {
      const newW = Math.max(80, startWidthRef.current + up.clientX - startXRef.current);
      updateAttributes({ width: `${newW}px` });
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // In-text drag: drag image left/right to flip float side
  const onMouseDownFloat = (e: React.MouseEvent) => {
    if (imgAlign !== 'in-text' && imgAlign !== 'float-left' && imgAlign !== 'float-right') return;
    floatDragStartX.current = e.clientX;
    const onMouseMove = (mv: MouseEvent) => {
      const delta = mv.clientX - floatDragStartX.current;
      if (Math.abs(delta) > 20) {
        const nextAlign = delta > 0 ? 'float-right' : 'float-left';
        if (nextAlign !== node.attrs.align) {
          updateAttributes({ align: nextAlign });
        }
      }
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const imgEl = (
    <img
      ref={imgRef}
      src={src}
      alt={alt || ''}
      title={title || ''}
      style={{
        width: width || 'auto',
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        borderRadius: '6px',
        border: selected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
        boxShadow: selected ? '0 0 0 3px rgba(200,66,10,0.18)' : 'var(--shadow-sm)',
        cursor: isResizing ? 'ew-resize' : isInText ? 'grab' : 'pointer',
        userSelect: 'none',
        transition: 'border 0.15s, box-shadow 0.15s',
      }}
      onMouseDown={(e) => {
        if (isInText) {
          e.stopPropagation();
          onMouseDownFloat(e);
        }
      }}
    />
  );

  const imageContent = (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="editor-image-link"
          style={{ pointerEvents: 'none', cursor: 'default', display: 'block' }}
        >{imgEl}</a>
      ) : imgEl}
      {/* Drag handle for moving the node in text */}
      {selected && (
        <div
          data-drag-handle
          className="img-drag-handle"
          title="Drag to move image"
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            background: 'var(--accent-color, #c8420a)',
            color: 'white',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 10,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 9 2 12 5 15"></polyline>
            <polyline points="9 5 12 2 15 5"></polyline>
            <polyline points="15 19 12 22 9 19"></polyline>
            <polyline points="19 9 22 12 19 15"></polyline>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="12" y1="2" x2="12" y2="22"></line>
          </svg>
        </div>
      )}
      {/* Right-side drag handle for resizing */}
      {selected && (
        <div onMouseDown={onMouseDownResize} className="img-resize-handle" title="Drag to resize">
          <span>⋮⋮</span>
        </div>
      )}
      {/* In-text float badge */}
      {selected && isInText && (
        <div style={{
          position: 'absolute', bottom: '6px', left: '6px',
          background: 'rgba(13,46,78,0.85)', color: 'white',
          fontSize: '10px', fontWeight: 700, padding: '2px 7px',
          borderRadius: '4px', pointerEvents: 'none',
          letterSpacing: '0.04em'
        }}>
          {floatSide === 'right' ? '← Drag left to flip' : 'Drag right to flip →'}
        </div>
      )}
    </div>
  );

  return (
    <NodeViewWrapper
      as="div"
      className="resizable-image-node-view"
      contentEditable={false}
      draggable={true}
      style={{ 
        display: 'block', 
        width: '100%', 
        margin: '4px 0',
        clear: isInText ? 'none' : 'both'
      }}
    >
      {isInText ? (
        <div style={{ display: 'block', ...getWrapperStyle() }}>{imageContent}</div>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: imgAlign === 'left' ? 'flex-start' : imgAlign === 'right' ? 'flex-end' : 'center',
          width: '100%',
          ...getWrapperStyle()
        }}>
          {imageContent}
        </div>
      )}
    </NodeViewWrapper>
  );
}

// Custom Image Extension: supports href, width, align (including float variants) + ReactNodeView
const CustomImage = Image.extend({
  inline: false,
  group: 'block',
  addAttributes() {
    return {
      ...this.parent?.(),
      href: {
        default: null,
        parseHTML: element => element.getAttribute('data-href') || null,
        renderHTML: attributes => attributes.href ? { 'data-href': attributes.href } : {},
      },
      target: { default: '_blank' },
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width') || element.style.width || null,
        renderHTML: attributes => {
          if (!attributes.width) return {};
          return {
            width: attributes.width,
            style: `width: ${attributes.width};`
          };
        },
      },
      align: {
        default: 'center',
        parseHTML: element => {
          const selfAlign = element.getAttribute('data-align');
          if (selfAlign) return selfAlign;
          let current: HTMLElement | null = element.parentElement;
          for (let i = 0; i < 3 && current; i++) {
            const parentAlign = current.getAttribute('data-align');
            if (parentAlign) return parentAlign;
            current = current.parentElement;
          }
          return 'center';
        },
        renderHTML: attributes => {
          return { 'data-align': attributes.align };
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { href, 'data-href': dataHref, 'data-align': dataAlign, width, ...rest } = HTMLAttributes;
    const actualHref = href || dataHref;
    const a = dataAlign || 'center';
    const w = width ? `width:${width};` : '';

    let wrapStyle = '';
    switch (a) {
      case 'float-left':
      case 'in-text':
        wrapStyle = `float:left;margin-right:20px;margin-bottom:12px;margin-top:4px;display:block;`;
        break;
      case 'float-right':
        wrapStyle = `float:right;margin-left:20px;margin-bottom:12px;margin-top:4px;display:block;`;
        break;
      case 'left':
        wrapStyle = `display:block;margin-left:0;margin-right:auto;margin-top:12px;margin-bottom:4px;`;
        break;
      case 'right':
        wrapStyle = `display:block;margin-left:auto;margin-right:0;margin-top:12px;margin-bottom:4px;`;
        break;
      default:
        wrapStyle = `display:block;margin-left:auto;margin-right:auto;margin-top:12px;margin-bottom:4px;`;
    }

    const imgStyle = `${w}max-width:100%;height:auto;display:block;border-radius:6px;`;
    const imgNode = ['img', mergeAttributes(this.options.HTMLAttributes, rest, { style: imgStyle })];
    const innerNode = actualHref
      ? ['a', { href: actualHref, target: '_blank', rel: 'noopener noreferrer', style: 'display:block;' }, imgNode]
      : imgNode;

    return ['div', { style: wrapStyle, class: 'article-image-wrapper' }, innerNode] as any;
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNodeView);
  },
});

// Custom Font Size Extension to support text-style size attribute
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize?.replace(/['"]+/g, '') || null,
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .run();
      },
    };
  },
});

// Custom Line Height Extension — applies line-height to paragraphs and headings
const LineHeight = Extension.create({
  name: 'lineHeight',
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.lineHeight || null,
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.lineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({ commands }: { commands: any }) => {
        return commands.updateAttributes('paragraph', { lineHeight }) &&
               commands.updateAttributes('heading', { lineHeight });
      },
      unsetLineHeight: () => ({ commands }: { commands: any }) => {
        return commands.updateAttributes('paragraph', { lineHeight: null }) &&
               commands.updateAttributes('heading', { lineHeight: null });
      },
    } as any;
  },
});

// Custom Font Family Extension to support text-style font-family attribute
const FontFamily = Extension.create({
  name: 'fontFamily',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontFamily?.replace(/['"]+/g, '') || null,
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.fontFamily) {
                return {};
              }
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontFamily: (fontFamily: string) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontFamily })
          .run();
      },
      unsetFontFamily: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontFamily: null })
          .run();
      },
    };
  },
});

// React Component for Horizontal Rule Node View to support interactive width, thickness and alignment updates
function HorizontalRuleNodeView({ node, selected }: any) {
  const { width, thickness, align } = node.attrs;
  const alignVal = align || 'center';
  const marginLeft = alignVal === 'left' ? '0' : alignVal === 'right' ? 'auto' : 'auto';
  const marginRight = alignVal === 'right' ? '0' : alignVal === 'left' ? 'auto' : 'auto';

  const combinedStyle = {
    width: width || '100%',
    height: thickness || '2px',
    border: 'none',
    backgroundColor: '#cbd5e1',
    marginLeft,
    marginRight,
    marginTop: '24px',
    marginBottom: '24px',
    display: 'block',
    cursor: 'pointer',
    outline: selected ? '2px solid var(--accent-color)' : 'none',
    outlineOffset: '2px',
    transition: 'outline 0.15s ease-in-out'
  };

  return (
    <NodeViewWrapper className="horizontal-rule-node-view-wrapper" style={{ width: '100%' }}>
      <hr style={combinedStyle} />
    </NodeViewWrapper>
  );
}

// Custom Horizontal Rule Extension supporting width, thickness, and alignment styles
const CustomHorizontalRule = Node.create({
  name: 'horizontalRule',
  group: 'block',
  
  addAttributes() {
    return {
      width: {
        default: '100%',
        parseHTML: element => element.style.width || '100%',
        renderHTML: attributes => {
          return {
            style: `width: ${attributes.width};`,
          };
        },
      },
      thickness: {
        default: '2px',
        parseHTML: element => element.style.height || '2px',
        renderHTML: attributes => {
          return {
            style: `height: ${attributes.thickness};`,
          };
        },
      },
      align: {
        default: 'center',
        parseHTML: element => {
          const ml = element.style.marginLeft;
          const mr = element.style.marginRight;
          if (ml === '0px' || ml === '0') return 'left';
          if (mr === '0px' || mr === '0') return 'right';
          return 'center';
        },
        renderHTML: attributes => {
          const align = attributes.align;
          const marginLeft = align === 'left' ? '0' : align === 'right' ? 'auto' : 'auto';
          const marginRight = align === 'right' ? '0' : align === 'left' ? 'auto' : 'auto';
          return {
            style: `margin-left: ${marginLeft}; margin-right: ${marginRight};`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'hr' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { style, ...rest } = HTMLAttributes;
    const align = HTMLAttributes.align || 'center';
    const marginLeft = align === 'left' ? '0' : align === 'right' ? 'auto' : 'auto';
    const marginRight = align === 'right' ? '0' : align === 'left' ? 'auto' : 'auto';
    const combinedStyle = `width: ${HTMLAttributes.width || '100%'}; height: ${HTMLAttributes.thickness || '2px'}; border: none; background-color: #cbd5e1; margin-left: ${marginLeft}; margin-right: ${marginRight}; margin-top: 24px; margin-bottom: 24px; display: block;`;
    
    return ['hr', mergeAttributes(rest, { style: combinedStyle })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HorizontalRuleNodeView);
  },

  addCommands() {
    return {
      setHorizontalRule: () => ({ chain }) => {
        return chain()
          .insertContent({ type: this.name })
          .run();
      },
    };
  },
});


// Custom Minimal Link Mark to bypass the official extension's crashing bugs
const CustomLink = Mark.create({
  name: 'link',
  priority: 1000,
  keepOnSplit: false,
  inclusive: false,
  addAttributes() {
    return {
      href: { default: null },
      target: { default: '_blank' },
      class: { default: null },
    }
  },
  parseHTML() {
    return [{ tag: 'a[href]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['a', mergeAttributes(HTMLAttributes), 0]
  },
  addCommands() {
    return {
      setLink: (attributes) => ({ commands }) => {
        return commands.setMark(this.name, attributes)
      },
      unsetLink: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },
});

// Custom HTML Block Node View component
function HTMLBlockNodeView({ node, updateAttributes, deleteNode }: any) {
  const [isEditing, setIsEditing] = useState(true);
  const html = node.attrs.html || '';

  const handleTextareaKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <NodeViewWrapper 
      className="html-block-node-wrapper" 
      style={{ 
        margin: '24px 0', 
        border: '1px solid var(--border-color)', 
        borderRadius: '8px', 
        overflow: 'hidden',
        background: '#f9fafb'
      }}
    >
      <div 
        style={{ 
          background: '#f3f4f6', 
          padding: '8px 16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid var(--border-color)',
          userSelect: 'none'
        }}
      >
        <span 
          data-drag-handle=""
          style={{ 
            fontSize: '13px', 
            fontWeight: 600, 
            color: 'var(--primary-color)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            cursor: 'grab',
            flex: 1,
            paddingRight: '12px'
          }}
          title="Drag to reposition this block"
        >
          ⠿ Custom HTML Block
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            style={{
              background: 'white',
              border: '1px solid var(--border-color)',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              color: 'var(--primary-color)',
              transition: 'background 0.2s'
            }}
          >
            {isEditing ? '👁️ Preview' : '✏️ Edit'}
          </button>
          <button
            type="button"
            onClick={deleteNode}
            style={{
              background: 'white',
              border: '1px solid #fecaca',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              color: '#ef4444',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#fef2f2')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'white')}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <textarea
          value={html}
          onChange={(e) => updateAttributes({ html: e.target.value })}
          onKeyDown={handleTextareaKeyDown}
          placeholder="Paste or write your custom HTML, forms, embed codes, or scripts here..."
          style={{
            width: '100%',
            minHeight: '140px',
            padding: '16px',
            fontFamily: 'SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
            fontSize: '13px',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            display: 'block',
            background: '#ffffff',
            color: '#1f2937',
            lineHeight: '1.5'
          }}
        />
      ) : (
        <div 
          style={{ padding: '20px', background: 'white', overflowX: 'auto' }}
          dangerouslySetInnerHTML={{ __html: html || '<div style="color: #9ca3af; font-style: italic; text-align: center; padding: 12px;">Empty HTML Block. Click "Edit Code" to paste HTML.</div>' }}
        />
      )}
    </NodeViewWrapper>
  );
}

// Custom TipTap HTML Block extension
const HTMLBlock = Node.create({
  name: 'htmlBlock',
  group: 'block',
  atom: true,
  draggable: true, // Enable drag & drop!
  
  addAttributes() {
    return {
      html: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-html-block="true"]',
        getAttrs: element => ({
          html: (element as HTMLElement).getAttribute('data-content') || '',
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 
      'data-html-block': 'true', 
      'data-content': HTMLAttributes.html 
    }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HTMLBlockNodeView);
  },
});

// Grid picker for table insert (rows × cols)
function TableInsertButton({ editor }: { editor: any }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<{ rows: number; cols: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ROWS = 8;
  const COLS = 10;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as globalThis.Node)) {
        setOpen(false);
        setHovered(null);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const insertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setOpen(false);
    setHovered(null);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`toolbar-btn ${editor.isActive('table') ? 'is-active' : ''}`}
        title="Insert Table"
      >
        <TableIcon size={18} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.13)',
          zIndex: 999,
          padding: '12px',
          minWidth: '220px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            {hovered ? `${hovered.rows} × ${hovered.cols} table` : 'Select size'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 20px)`, gap: '3px' }}>
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => {
                const row = r + 1;
                const col = c + 1;
                const active = hovered && row <= hovered.rows && col <= hovered.cols;
                return (
                  <div
                    key={`${row}-${col}`}
                    onMouseEnter={() => setHovered({ rows: row, cols: col })}
                    onMouseLeave={() => setHovered(null)}
                    onMouseDown={e => { e.preventDefault(); insertTable(row, col); }}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '3px',
                      background: active ? 'var(--accent-color, #c8420a)' : '#e5e7eb',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                  />
                );
              })
            )}
          </div>
          {editor.isActive('table') && (
            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '10px', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Table actions</div>
              {[
                { label: 'Add row above', fn: () => editor.chain().focus().addRowBefore().run() },
                { label: 'Add row below', fn: () => editor.chain().focus().addRowAfter().run() },
                { label: 'Add column left', fn: () => editor.chain().focus().addColumnBefore().run() },
                { label: 'Add column right', fn: () => editor.chain().focus().addColumnAfter().run() },
                { label: 'Delete row', fn: () => editor.chain().focus().deleteRow().run() },
                { label: 'Delete column', fn: () => editor.chain().focus().deleteColumn().run() },
                { label: 'Delete table', fn: () => editor.chain().focus().deleteTable().run() },
              ].map(({ label, fn }) => (
                <button
                  key={label}
                  type="button"
                  onMouseDown={e => { e.preventDefault(); fn(); setOpen(false); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '5px 8px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: label.startsWith('Delete') ? '#ef4444' : 'var(--text-main)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const extensions = [
  StarterKit.configure({
    horizontalRule: false,
  }),
  CustomImage,
  CustomLink,
  BlurredSelectionHighlight,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
  }),
  TextStyle,
  Color,
  FontSize,
  FontFamily,
  LineHeight,
  CustomHorizontalRule,
  HTMLBlock,
  Table.configure({ resizable: true }),
  TableRow,
  TableCell,
  TableHeader,
];

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  toolbarPortalId?: string;
}

export default function TipTapEditor({ content, onChange, toolbarPortalId }: TipTapEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const [tableCtxMenu, setTableCtxMenu] = useState<{ x: number; y: number } | null>(null);
  const tableCtxMenuRef = useRef<HTMLDivElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [styleAsButton, setStyleAsButton] = useState(false);

  // Bubble Menu Link State
  const [bubbleLinkUrl, setBubbleLinkUrl] = useState('');
  const [isEditingBubbleLink, setIsEditingBubbleLink] = useState(false);
  const [bubbleMenuPos, setBubbleMenuPos] = useState<{ top: number; left: number } | null>(null);

  // Image SEO Attributes State
  const [isEditingImageSettings, setIsEditingImageSettings] = useState(false);
  const [tempAltText, setTempAltText] = useState('');
  const [tempTitleText, setTempTitleText] = useState('');

  // Horizontal Rule settings state
  const [isEditingHorizontalRuleSettings, setIsEditingHorizontalRuleSettings] = useState(false);

  // Portal target element state
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (toolbarPortalId) {
      const el = document.getElementById(toolbarPortalId);
      if (el) {
        setPortalElement(el);
      }
    }
  }, [toolbarPortalId]);

  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: () => {
      forceUpdate(v => v + 1);
    },
    editorProps: {
      handleClickOn(view, pos, node, nodePos, event, direct) {
        if (node.type.name === 'image') {
          const { selection } = view.state;
          const isCurrentlySelected = selection instanceof NodeSelection && selection.from === nodePos;
          if (isCurrentlySelected) {
            // Deselect: place text cursor at nodePos
            const tr = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(nodePos)));
            view.dispatch(tr);
          } else {
            // Select: select image node
            const tr = view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos));
            view.dispatch(tr);
          }
          return true;
        }
        return false;
      }
    }
  });

  // Keep bubbleLinkUrl synced with selected link href or image href
  useEffect(() => {
    if (!editor) return;
    const { selection } = editor.state;
    if (selection instanceof NodeSelection && selection.node.type.name === 'image') {
      setBubbleLinkUrl(selection.node.attrs.href || '');
    } else if (editor.isActive('link')) {
      setBubbleLinkUrl(editor.getAttributes('link').href || '');
    }
  }, [editor?.state.selection]);

  // Positioning the custom floating bubble menu above selected text, image, or horizontal rule
  useEffect(() => {
    if (!editor) return;

    const updateBubbleMenu = () => {
      const { selection } = editor.state;
      const isImageSelected = selection instanceof NodeSelection && selection.node.type.name === 'image';
      const isHorizontalRuleSelected = selection instanceof NodeSelection && selection.node.type.name === 'horizontalRule';
      const hasTextSelection = !selection.empty && !(selection instanceof NodeSelection);
      const isCursorOnLink = editor.isActive('link');

      // Images have their own inline NodeView settings panel — no floating bubble menu needed for them
      // If nothing is selected, cursor is not on a link, and no horizontal line is selected, hide menu
      if (!hasTextSelection && !isCursorOnLink && !isHorizontalRuleSelected) {
        setBubbleMenuPos(null);
        setIsEditingBubbleLink(false);
        setIsEditingImageSettings(false);
        setIsEditingHorizontalRuleSettings(false);
        return;
      }

      // Small delay to ensure DOM selection has updated
      setTimeout(() => {
        const domSelection = window.getSelection();
        if (!domSelection || domSelection.rangeCount === 0 || !containerRef.current) {
          setBubbleMenuPos(null);
          return;
        }

        try {
          const range = domSelection.getRangeAt(0);
          let rect = range.getBoundingClientRect();

          // Hide if the selection area is empty/invisible AND we are not on a link/HR
          if (rect.width === 0 && rect.height === 0 && !editor.isActive('link') && !isHorizontalRuleSelected) {
            setBubbleMenuPos(null);
            return;
          }

          // If we are on a link and selection is collapsed (cursor), target the link DOM element itself
          if (editor.isActive('link') && (rect.width === 0 || selection.empty)) {
            let node = domSelection.anchorNode;
            while (node && node !== containerRef.current) {
              if (node.nodeName === 'A') {
                rect = (node as Element).getBoundingClientRect();
                break;
              }
              node = node.parentNode;
            }
          } else if (isImageSelected) {
            // Use ProseMirror's nodeDOM to find the actual image wrapper, since
            // ReactNodeViews do NOT update window.getSelection() to point at themselves.
            try {
              const nodeDOM = editor.view.nodeDOM((selection as any).from);
              if (nodeDOM) {
                const domEl = nodeDOM as Element;
                const imgEl = domEl.nodeName === 'IMG' ? domEl : domEl.querySelector?.('img') || domEl;
                rect = imgEl.getBoundingClientRect();
              }
            } catch (_) {
              // Fallback: try walking DOM selection
              let node = domSelection.anchorNode;
              while (node && node !== containerRef.current) {
                if (node.nodeName === 'IMG' || (node as Element).querySelector?.('img')) {
                  const imgEl = node.nodeName === 'IMG' ? (node as Element) : (node as Element).querySelector('img');
                  if (imgEl) rect = imgEl.getBoundingClientRect();
                  break;
                }
                node = node.parentNode;
              }
            }
          } else if (isHorizontalRuleSelected) {
            // Use ProseMirror's nodeDOM to find the actual HR wrapper, since
            // ReactNodeViews do NOT update window.getSelection() to point at themselves.
            try {
              const nodeDOM = editor.view.nodeDOM((selection as any).from);
              if (nodeDOM) {
                const domEl = nodeDOM as Element;
                // The NodeViewWrapper is the outer element; the <hr> is inside it
                const hrEl = domEl.nodeName === 'HR' ? domEl : domEl.querySelector?.('hr') || domEl;
                rect = hrEl.getBoundingClientRect();
              }
            } catch (_) {
              // Fallback: try walking DOM selection
              let node = domSelection.anchorNode;
              while (node && node !== containerRef.current) {
                if (node.nodeName === 'HR' || (node as Element).querySelector?.('hr')) {
                  const hrEl = node.nodeName === 'HR' ? (node as Element) : (node as Element).querySelector('hr');
                  if (hrEl) rect = hrEl.getBoundingClientRect();
                  break;
                }
                node = node.parentNode;
              }
            }
          }

          const containerRect = containerRef.current.getBoundingClientRect();

          // Position the bubble menu above the selection, relative to the container
          const top = rect.top - containerRect.top - 48;
          const left = rect.left - containerRect.left + rect.width / 2;

          setBubbleMenuPos({ top, left });
        } catch (e) {
          // Range error fallback
          setBubbleMenuPos(null);
        }
      }, 20);
    };

    editor.on('selectionUpdate', updateBubbleMenu);
    editor.on('focus', updateBubbleMenu);
    
    // Hide bubble menu on blur, unless focus shifts to the bubble menu inputs or modal
    const handleBlur = () => {
      setTimeout(() => {
        if (isInteractingRef.current) return;
        const activeEl = document.activeElement;
        if (!activeEl?.closest('.bubble-menu') && !activeEl?.closest('.toolbar-link-modal')) {
          setBubbleMenuPos(null);
          setIsEditingImageSettings(false);
          setIsEditingHorizontalRuleSettings(false);
        }
      }, 200);
    };
    editor.on('blur', handleBlur);

    return () => {
      editor.off('selectionUpdate', updateBubbleMenu);
      editor.off('focus', updateBubbleMenu);
      editor.off('blur', handleBlur);
    };
  }, [editor]);

  const uploadImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `blog-images/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('images') // Assumes a public bucket named 'images'
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        
        editor?.chain().focus().setImage({ src: data.publicUrl }).run();
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Make sure you have a public bucket named "images".');
      }
    };
    input.click();
  }, [editor]);

  // Insert Custom Link or Button Link from the top toolbar
  const handleInsertToolbarLink = (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!editor || !linkUrl) return;

    let targetUrl = linkUrl;
    // Add protocol prefix if missing
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    const textToInsert = linkText || targetUrl;

    // Check if the current selection is a NodeSelection (e.g. an image is selected).
    // If so, move the cursor to after the node so we don't overwrite it.
    const { selection } = editor.state;
    if (selection instanceof NodeSelection) {
      editor.commands.setTextSelection(selection.to);
    }

    if (styleAsButton) {
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${targetUrl}" class="blog-button" target="_blank">${textToInsert}</a>`
        )
        .run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${targetUrl}" target="_blank">${textToInsert}</a>`
        )
        .run();
    }

    // Reset fields
    setLinkText('');
    setLinkUrl('');
    setStyleAsButton(false);
    setShowLinkModal(false);
  };

  // Set link inside the bubble menu (inline formatting or image link)
  const applyInlineBubbleLink = () => {
    if (!editor || !bubbleLinkUrl) return;
    
    let targetUrl = bubbleLinkUrl;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    const { selection } = editor.state;
    const isImageSelected = selection instanceof NodeSelection && selection.node.type.name === 'image';

    if (isImageSelected) {
      editor.chain().focus().updateAttributes('image', { href: targetUrl }).run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: targetUrl })
        .run();
    }
    setIsEditingBubbleLink(false);
  };

  // Remove link inside the bubble menu (unlink)
  const removeInlineBubbleLink = () => {
    if (!editor) return;

    const { selection } = editor.state;
    const isImageSelected = selection instanceof NodeSelection && selection.node.type.name === 'image';

    if (isImageSelected) {
      editor.chain().focus().updateAttributes('image', { href: null }).run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run();
    }
    setIsEditingBubbleLink(false);
    setBubbleLinkUrl('');
  };

  // Context-aware text alignment: aligns all text if selection is empty, or only selected text
  const handleAlign = (alignment: string) => {
    if (!editor) return;

    const { selection } = editor.state;
    const { from } = selection;
    const isActive = editor.isActive({ textAlign: alignment });

    if (selection.empty) {
      if (isActive) {
        editor
          .chain()
          .focus()
          .selectAll()
          .unsetTextAlign()
          .setTextSelection(from)
          .run();
      } else {
        editor
          .chain()
          .focus()
          .selectAll()
          .setTextAlign(alignment)
          .setTextSelection(from)
          .run();
      }
    } else {
      if (isActive) {
        editor.chain().focus().unsetTextAlign().run();
      } else {
        editor.chain().focus().setTextAlign(alignment).run();
      }
    }
  };

  // ── TABLE RIGHT-CLICK CONTEXT MENU close handler ──
  useEffect(() => {
    const close = (e: MouseEvent | KeyboardEvent) => {
      if ('key' in e && (e as KeyboardEvent).key !== 'Escape') return;
      if (tableCtxMenuRef.current && e instanceof MouseEvent && tableCtxMenuRef.current.contains(e.target as globalThis.Node)) return;
      setTableCtxMenu(null);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, []);

  if (!editor) return null;

  const { selection: activeSelection } = editor.state;
  const isImageSelected = activeSelection instanceof NodeSelection && activeSelection.node.type.name === 'image';
  const isHorizontalRuleSelected = activeSelection instanceof NodeSelection && activeSelection.node.type.name === 'horizontalRule';
  const selectedImageHref = isImageSelected ? (activeSelection.node.attrs.href || null) : null;

  const toolbarAndModal = (
    <div className="editor-toolbar-sticky-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: 0, zIndex: 40 }}>
      {/* ── TOP EDITOR TOOLBAR ── */}
      <div className="editor-toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`}>
          <Bold size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`}>
          <Italic size={18} />
        </button>
        {/* Headings Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <select
            className="toolbar-select"
            value={
              editor.isActive('heading', { level: 1 }) ? 'h1' :
              editor.isActive('heading', { level: 2 }) ? 'h2' :
              editor.isActive('heading', { level: 3 }) ? 'h3' :
              editor.isActive('heading', { level: 4 }) ? 'h4' :
              'paragraph'
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'paragraph') {
                editor.chain().focus().setParagraph().run();
              } else {
                const level = parseInt(val.replace('h', ''), 10) as any;
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
            title="Text Style / Headings"
            style={{ width: '110px' }}
          >
            <option value="paragraph">Normal Text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>
        </div>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`toolbar-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}>
          <List size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`toolbar-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}>
          <ListOrdered size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`toolbar-btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`} title="Code Snippet">
          <Code size={18} />
        </button>
        <button 
          type="button" 
          onClick={() => editor.chain().focus().insertContent({ type: 'htmlBlock', attrs: { html: '' } }).run()} 
          className={`toolbar-btn ${editor.isActive('htmlBlock') ? 'is-active' : ''}`}
          title="Insert Custom HTML / Form Block"
        >
          <FileCode size={18} />
        </button>
        <button
          type="button"
          onClick={() => (editor.chain().focus() as any).setHorizontalRule().run()}
          className="toolbar-btn"
          title="Insert Divider Line"
        >
          <Minus size={18} />
        </button>
        <TableInsertButton editor={editor} />

        <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 8px' }}></div>

        {/* Alignment Buttons */}
        <button 
          type="button" 
          onClick={() => handleAlign('left')} 
          className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
          title="Align Left"
        >
          <AlignLeft size={18} />
        </button>
        <button 
          type="button" 
          onClick={() => handleAlign('center')} 
          className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
          title="Align Center"
        >
          <AlignCenter size={18} />
        </button>
        <button 
          type="button" 
          onClick={() => handleAlign('right')} 
          className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
          title="Align Right"
        >
          <AlignRight size={18} />
        </button>
        <button 
          type="button" 
          onClick={() => handleAlign('justify')} 
          className={`toolbar-btn ${editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}`}
          title="Justify"
        >
          <AlignJustify size={18} />
        </button>

        <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 8px' }}></div>

        {/* Font Family Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <select
            className="toolbar-select"
            value={editor.getAttributes('textStyle').fontFamily || 'default'}
            onChange={(e) => {
              const font = e.target.value;
              if (font === 'default') {
                (editor.chain().focus() as any).unsetFontFamily().run();
              } else {
                (editor.chain().focus() as any).setFontFamily(font).run();
              }
            }}
            title="Font Style"
            style={{ width: '130px' }}
          >
            <option value="default">Default Font</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Impact, Charcoal, sans-serif">Impact</option>
            <option value="'Courier New', Courier, monospace">Courier New</option>
            <option value="'Times New Roman', Times, serif">Times New Roman</option>
            <option value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet MS</option>
            <option value="'Comic Sans MS', cursive, sans-serif">Comic Sans MS</option>
          </select>
        </div>

        <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 8px' }}></div>

        {/* Font Size Picker */}
        <FontSizePicker
          value={editor.getAttributes('textStyle').fontSize || '16px'}
          onChange={(size) => {
            (editor.chain().focus() as any).setFontSize(size).run();
          }}
        />

        <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 8px' }}></div>

        {/* Line Spacing Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <select
            className="toolbar-select"
            value={
              editor.getAttributes('paragraph').lineHeight ||
              editor.getAttributes('heading').lineHeight ||
              'default'
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'default') {
                (editor.chain().focus() as any).unsetLineHeight().run();
              } else {
                (editor.chain().focus() as any).setLineHeight(val).run();
              }
            }}
            title="Line Spacing"
            style={{ width: '90px' }}
          >
            <option value="default">Spacing</option>
            <option value="1">Single</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5</option>
            <option value="2">Double</option>
            <option value="2.5">2.5</option>
            <option value="3">Triple</option>
          </select>
        </div>

        <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 8px' }}></div>

        {/* Text Color Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Color:</span>
          <input
            type="color"
            value={editor.getAttributes('textStyle').color || '#111827'}
            onChange={(e) => {
              (editor.chain().focus() as any).setColor(e.target.value).run();
            }}
            style={{
              width: '24px',
              height: '24px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              cursor: 'pointer',
              padding: 0,
              backgroundColor: 'transparent',
            }}
            title="Custom Color"
          />
          <button
            type="button"
            onClick={() => (editor.chain().focus() as any).unsetColor().run()}
            className="color-dot-btn reset"
            title="Reset to default color"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={() => (editor.chain().focus() as any).setColor('#c8420a').run()}
            className={`color-dot-btn ${editor.getAttributes('textStyle').color === '#c8420a' ? 'is-active' : ''}`}
            style={{ backgroundColor: '#c8420a' }}
            title="Orange"
          />
          <button
            type="button"
            onClick={() => (editor.chain().focus() as any).setColor('#0d2e4e').run()}
            className={`color-dot-btn ${editor.getAttributes('textStyle').color === '#0d2e4e' ? 'is-active' : ''}`}
            style={{ backgroundColor: '#0d2e4e' }}
            title="Navy"
          />
          <button
            type="button"
            onClick={() => (editor.chain().focus() as any).setColor('#10b981').run()}
            className={`color-dot-btn ${editor.getAttributes('textStyle').color === '#10b981' ? 'is-active' : ''}`}
            style={{ backgroundColor: '#10b981' }}
            title="Green"
          />
        </div>

        <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 8px' }}></div>
        
        <button type="button" onClick={uploadImage} className="toolbar-btn" title="Insert Image">
          <ImageIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => {
            const selectedText = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to);
            setLinkText(selectedText);
            setShowLinkModal(!showLinkModal);
          }}
          className={`toolbar-btn ${showLinkModal ? 'is-active' : ''}`}
          title="Insert Link/Button"
        >
          <LinkIcon size={18} />
        </button>
      </div>
      
      {/* ── TOP TOOLBAR LINK/BUTTON INSERTION MODAL ── */}
      {showLinkModal && (
        <div 
          className="toolbar-link-modal"
          style={{
            padding: '20px',
            border: '1px solid var(--border-color)',
            background: 'white',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'var(--shadow-md)',
            marginTop: '4px'
          }}
        >
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--primary-color)' }}>
            Insert Link or Button
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 80px', gap: '12px', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '12px' }}>Link Text (optional)</label>
              <input
                type="text"
                value={linkText}
                onChange={e => setLinkText(e.target.value)}
                placeholder="e.g. Join Now"
                className="form-input"
                style={{ padding: '6px 12px', minHeight: '34px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleInsertToolbarLink(e);
                  }
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '12px' }}>Link URL</label>
              <input 
                type="text" 
                value={linkUrl} 
                onChange={e => setLinkUrl(e.target.value)} 
                placeholder="e.g. navigationtrading.com" 
                className="form-input" 
                style={{ padding: '6px 12px', minHeight: '34px' }}
                required
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleInsertToolbarLink(e);
                  }
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="form-label" style={{ fontSize: '12px', marginBottom: 0 }}>Style as Button</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', height: '34px' }}>
                <input
                  type="checkbox"
                  checked={styleAsButton}
                  onChange={e => setStyleAsButton(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                Yes
              </label>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => handleInsertToolbarLink()}
                className="btn-primary" 
                style={{ padding: '6px 16px', fontSize: '13px', minHeight: '34px', width: '100%', justifyContent: 'center' }}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── IMAGE SETTINGS PANEL IN TOOLBAR ── shown when image is selected */}
      {isImageSelected && (() => {
        const imgAttrs = (activeSelection as any).node.attrs;
        const imgAlignVal = imgAttrs.align || 'center';
        return (
          <div
            className="image-settings-panel toolbar-image-panel"
            onMouseDown={e => e.stopPropagation()}
          >
            {/* Row 1: Position & Width side-by-side Dropdowns */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="image-settings-label" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Position &amp; Wrap:</span>
                <select
                  value={imgAlignVal}
                  onChange={e => {
                    editor.commands.updateAttributes('image', { align: e.target.value });
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid var(--border-color)',
                    background: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    minWidth: '160px',
                    outline: 'none',
                  }}
                >
                  {IMAGE_POSITIONS.map(pos => (
                    <option key={pos.key} value={pos.key}>
                      {pos.label} — {pos.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="image-settings-label" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Width:</span>
                <select
                  value={imgAttrs.width || 'auto'}
                  onChange={e => {
                    editor.commands.updateAttributes('image', { width: e.target.value === 'auto' ? null : e.target.value });
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid var(--border-color)',
                    background: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    minWidth: '120px',
                    outline: 'none',
                  }}
                >
                  {WIDTH_PRESETS.map(w => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Alt Text & Link URL side by side */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '12px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.5px' }}>Alt Text (SEO)</span>
                <input
                  type="text"
                  className="image-settings-input"
                  placeholder="Describe this image..."
                  defaultValue={imgAttrs.alt || ''}
                  key={`alt-${(activeSelection as any).from}`}
                  onBlur={e => editor.commands.updateAttributes('image', { alt: e.target.value })}
                  onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') editor.commands.updateAttributes('image', { alt: (e.target as HTMLInputElement).value }); }}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid var(--border-color)', fontSize: '13px' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.5px' }}>Link URL (Optional)</span>
                <input
                  type="text"
                  className="image-settings-input"
                  placeholder="https://example.com..."
                  defaultValue={imgAttrs.href || ''}
                  key={`href-${(activeSelection as any).from}`}
                  onBlur={e => editor.commands.updateAttributes('image', { href: e.target.value || null })}
                  onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') editor.commands.updateAttributes('image', { href: (e.target as HTMLInputElement).value || null }); }}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid var(--border-color)', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );

  const handleContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('td, th')) return;
    e.preventDefault();
    setTableCtxMenu({ x: e.clientX, y: e.clientY });
  };

  const tableActions = [
    { label: 'Insert row above', fn: () => editor.chain().focus().addRowBefore().run(), danger: false },
    { label: 'Insert row below', fn: () => editor.chain().focus().addRowAfter().run(), danger: false },
    { label: 'Insert column to the left', fn: () => editor.chain().focus().addColumnBefore().run(), danger: false },
    { label: 'Insert column to the right', fn: () => editor.chain().focus().addColumnAfter().run(), danger: false },
    null,
    { label: 'Delete row', fn: () => editor.chain().focus().deleteRow().run(), danger: true },
    { label: 'Delete column', fn: () => editor.chain().focus().deleteColumn().run(), danger: true },
    { label: 'Delete table', fn: () => editor.chain().focus().deleteTable().run(), danger: true },
  ];

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* ── CUSTOM FLOATING BUBBLE MENU ── */}
      {bubbleMenuPos && (
        <div 
          className="bubble-menu"
          onMouseEnter={() => { isInteractingRef.current = true; }}
          onMouseLeave={() => { isInteractingRef.current = false; }}
          style={{
            position: 'absolute',
            top: `${bubbleMenuPos.top}px`,
            left: `${bubbleMenuPos.left}px`,
            transform: 'translateX(-50%)',
            zIndex: 90,
          }}
        >
          {isEditingHorizontalRuleSettings ? (
            /* Horizontal Rule settings form */
            <div className="bubble-menu-input-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>Width:</span>
              <select
                value={editor.getAttributes('horizontalRule').width || '100%'}
                onChange={(e) => {
                  editor.commands.updateAttributes('horizontalRule', { width: e.target.value });
                }}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: 'white', fontSize: '12px', padding: '2px' }}
              >
                <option value="25%" style={{ color: 'black' }}>25%</option>
                <option value="50%" style={{ color: 'black' }}>50%</option>
                <option value="75%" style={{ color: 'black' }}>75%</option>
                <option value="100%" style={{ color: 'black' }}>100%</option>
              </select>

              <span style={{ color: 'white', fontSize: '12px', fontWeight: 600, marginLeft: '8px' }}>Thickness:</span>
              <select
                value={editor.getAttributes('horizontalRule').thickness || '2px'}
                onChange={(e) => {
                  editor.commands.updateAttributes('horizontalRule', { thickness: e.target.value });
                }}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: 'white', fontSize: '12px', padding: '2px' }}
              >
                <option value="1px" style={{ color: 'black' }}>1px</option>
                <option value="2px" style={{ color: 'black' }}>2px</option>
                <option value="4px" style={{ color: 'black' }}>4px</option>
                <option value="8px" style={{ color: 'black' }}>8px</option>
              </select>

              <span style={{ color: 'white', fontSize: '12px', fontWeight: 600, marginLeft: '8px' }}>Align:</span>
              <select
                value={editor.getAttributes('horizontalRule').align || 'center'}
                onChange={(e) => {
                  editor.commands.updateAttributes('horizontalRule', { align: e.target.value });
                }}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: 'white', fontSize: '12px', padding: '2px' }}
              >
                <option value="left" style={{ color: 'black' }}>Left</option>
                <option value="center" style={{ color: 'black' }}>Center</option>
                <option value="right" style={{ color: 'black' }}>Right</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().deleteSelection().run();
                  setIsEditingHorizontalRuleSettings(false);
                }}
                className="toolbar-btn"
                style={{ color: '#ef4444', fontSize: '12px', padding: '2px 8px', background: 'rgba(255,255,255,0.1)', marginLeft: '8px' }}
                title="Delete Line"
              >
                <Trash2 size={14} />
              </button>

              <button
                type="button"
                onClick={() => setIsEditingHorizontalRuleSettings(false)}
                className="toolbar-btn"
                style={{ color: '#10b981', fontSize: '12px', padding: '2px 8px', background: 'rgba(255,255,255,0.1)' }}
              >
                Done
              </button>
            </div>
          ) : isHorizontalRuleSelected ? (
            /* Horizontal Rule selection but not in settings mode */
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}>
              <button
                type="button"
                onClick={() => setIsEditingHorizontalRuleSettings(true)}
                className="toolbar-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
                title="Line Settings"
              >
                <Edit2 size={16} />
                <span style={{ fontSize: '13px', color: 'white', fontWeight: 500 }}>Line Settings</span>
              </button>
              <div className="bubble-divider"></div>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteSelection().run()}
                className="toolbar-btn"
                style={{ color: '#ef4444', padding: '6px 12px' }}
                title="Delete Line"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : isEditingBubbleLink ? (
            /* Inline Link input inside the bubble menu */
            <div className="bubble-menu-input-container">
              <input
                type="text"
                placeholder="Paste or type link..."
                value={bubbleLinkUrl}
                onChange={(e) => setBubbleLinkUrl(e.target.value)}
                className="bubble-menu-input"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyInlineBubbleLink();
                  if (e.key === 'Escape') setIsEditingBubbleLink(false);
                }}
              />
              <button type="button" onClick={applyInlineBubbleLink} className="toolbar-btn" style={{ color: '#10b981' }}>
                <Check size={16} />
              </button>
              <button type="button" onClick={() => setIsEditingBubbleLink(false)} className="toolbar-btn" style={{ color: '#ef4444' }}>
                <X size={16} />
              </button>
            </div>
          ) : editor.isActive('link') ? (
            /* Current Link Viewer (text links only - image links are handled in the NodeView panel) */
            <div className="bubble-menu-link-view">
              <a href={editor.getAttributes('link').href || '#'} target="_blank" rel="noopener noreferrer">
                {editor.getAttributes('link').href}
              </a>
              <div className="bubble-divider"></div>
              <button
                type="button"
                onClick={() => {
                  setBubbleLinkUrl(editor.getAttributes('link').href || '');
                  setIsEditingBubbleLink(true);
                }}
                className="toolbar-btn"
                title="Edit Link"
              >
                <Edit2 size={14} />
              </button>
              <button
                type="button"
                onClick={removeInlineBubbleLink}
                className="toolbar-btn"
                title="Unlink"
                style={{ color: '#ef4444' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            /* Basic Formatting Bubble Menu */
            <>
              <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`}>
                <Bold size={16} />
              </button>
              <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`}>
                <Italic size={16} />
              </button>
              <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}>
                <Heading2 size={16} />
              </button>
              <div className="bubble-divider"></div>
              <button
                type="button"
                onClick={() => {
                  setBubbleLinkUrl('');
                  setIsEditingBubbleLink(true);
                }}
                className="toolbar-btn"
                title="Add Link"
              >
                <LinkIcon size={16} />
              </button>
            </>
          )}
        </div>
      )}

      {/* ── TOP EDITOR TOOLBAR PORTALED OR INLINE ── */}
      {portalElement ? createPortal(toolbarAndModal, portalElement) : toolbarAndModal}
      
      <div className={portalElement ? 'editor-content-only' : ''} onContextMenu={handleContextMenu}>
        <EditorContent editor={editor} />
      </div>

      {tableCtxMenu && (
        <div
          ref={tableCtxMenuRef}
          className="table-context-menu"
          style={{ top: tableCtxMenu.y, left: tableCtxMenu.x }}
        >
          {tableActions.map((action, i) =>
            action === null ? (
              <div key={`div-${i}`} className="table-context-menu-divider" />
            ) : (
              <button
                key={action.label}
                type="button"
                className={`table-context-menu-item${action.danger ? ' danger' : ''}`}
                onMouseDown={e => { e.preventDefault(); action.fn(); setTableCtxMenu(null); }}
              >
                {action.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
