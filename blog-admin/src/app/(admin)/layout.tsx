'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, LogOut, Plus, Image, ChevronLeft, ChevronRight, SlidersHorizontal, MousePointerClick } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Persist collapse state across page loads
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') setCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    setCollapsed(prev => {
      localStorage.setItem('sidebar-collapsed', String(!prev));
      return !prev;
    });
  };

  const isActive = (path: string) => {
    if (path === '/admin-blog' && pathname === '/') return true;
    if (path !== '/admin-blog' && pathname.startsWith(path)) return true;
    return false;
  };

  const blogItems = [
    { href: '/admin-blog', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/posts/new', icon: <Plus size={20} />, label: 'New Post' },
    { href: '/banners', icon: <Image size={20} />, label: 'Sidebar Banners' },
  ];

  const videoItems = [
    { href: '/replay', icon: <FileText size={20} />, label: 'Replay Video' },
  ];

  const popupItems = [
    { href: '/exit-intent', icon: <MousePointerClick size={20} />, label: 'Exit Intent Popups' },
  ];

  const settingsItems = [
    { href: '/site-config', icon: <SlidersHorizontal size={20} />, label: 'Site Config' },
    { href: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <html lang="en">
      <body>
        <div className="admin-layout">
          {/* Sidebar */}
          <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 0 16px', margin: '0 16px 20px', minHeight: 'auto', height: 'auto', overflow: 'visible' }}>
              {collapsed ? (
                <div className="sidebar-logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', width: '36px', height: '36px', overflow: 'hidden' }}>
                  <img src="/logo.png" alt="NT" style={{ width: 'auto', height: '90px', objectFit: 'contain', marginTop: '-24px', marginBottom: '-24px' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', height: '60px', overflow: 'hidden', width: '100%', justifyContent: 'flex-start' }}>
                  <img src="/logo.png" alt="NavigationTrading" style={{ height: '140px', width: 'auto', objectFit: 'contain', marginTop: '-35px', marginBottom: '-35px', marginLeft: '-10px' }} />
                </div>
              )}
            </div>

            {/* Collapse Toggle Button */}
            <button
              className="sidebar-collapse-btn"
              onClick={toggleCollapse}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Nav Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 0 24px' }}>
              {/* Blog Group */}
              <div>
                {!collapsed && (
                  <div style={{ padding: '0 20px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)' }}>
                    Blog
                  </div>
                )}
                <ul className="nav-menu">
                  {blogItems.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                        title={collapsed ? item.label : undefined}
                        style={{ paddingLeft: collapsed ? '12px' : '32px' }}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Video Group */}
              <div>
                {!collapsed && (
                  <div style={{ padding: '0 20px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', margin: '0 16px 8px' }}>
                    Video
                  </div>
                )}
                {collapsed && <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '8px 16px 16px' }}></div>}
                <ul className="nav-menu">
                  {videoItems.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                        title={collapsed ? item.label : undefined}
                        style={{ paddingLeft: collapsed ? '12px' : '32px' }}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popups Group */}
              <div>
                {!collapsed && (
                  <div style={{ padding: '0 20px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', margin: '0 16px 8px' }}>
                    Popups
                  </div>
                )}
                {collapsed && <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '8px 16px 16px' }}></div>}
                <ul className="nav-menu">
                  {popupItems.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                        title={collapsed ? item.label : undefined}
                        style={{ paddingLeft: collapsed ? '12px' : '32px' }}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* System/Settings Group */}
              <div>
                {!collapsed && (
                  <div style={{ padding: '0 20px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', margin: '0 16px 8px' }}>
                    System
                  </div>
                )}
                {collapsed && <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '8px 16px 16px' }}></div>}
                <ul className="nav-menu">
                  {settingsItems.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                        title={collapsed ? item.label : undefined}
                        style={{ paddingLeft: collapsed ? '12px' : '32px' }}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom: Logout */}
            <div style={{ marginTop: 'auto' }}>
              <ul className="nav-menu">
                <li>
                  <a
                    href="/api/auth/logout"
                    className="nav-item"
                    style={{ color: '#ef4444' }}
                    title={collapsed ? 'Logout' : undefined}
                  >
                    <span className="nav-icon"><LogOut size={20} /></span>
                    {!collapsed && <span className="nav-label">Logout</span>}
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="main-content">
            <header className="topbar">
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                Blog Management System
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Admin User</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  A
                </div>
              </div>
            </header>
            
            <div className="page-container">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
