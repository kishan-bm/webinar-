'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, FileText, Settings, LogOut, Plus, Image, ChevronLeft, ChevronRight, LayoutPanelLeft, Video } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [accountLabel, setAccountLabel] = useState('Admin User');

  // Persist collapse state across page loads
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') setCollapsed(true);
  }, []);

  // Pull the real logged-in admin's email from the session, if available
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.success && data.user?.email) {
          setAccountLabel(data.user.email);
        }
      })
      .catch(() => {});
  }, []);

  const toggleCollapse = () => {
    setCollapsed(prev => {
      localStorage.setItem('sidebar-collapsed', String(!prev));
      return !prev;
    });
  };

  const isActive = (path: string) => {
    if (path === '/admin-blog' && (pathname === '/' || pathname === '/admin-blog')) return true;
    if (path === '/posts' && pathname === '/posts') return true;
    if (path !== '/admin-blog' && path !== '/posts' && pathname.startsWith(path)) return true;
    return false;
  };

  const blogItems = [
    { href: '/admin-blog', icon: <Compass size={20} />, label: 'Overview' },
    { href: '/posts', icon: <FileText size={20} />, label: 'Posts' },
    { href: '/posts/new', icon: <Plus size={20} />, label: 'New Post' },
    { href: '/banners', icon: <Image size={20} />, label: 'Sidebar Banners' },
  ];

  const marketingItems = [
    { href: '/site-config', icon: <LayoutPanelLeft size={20} />, label: 'Pages' },
    { href: '/replay', icon: <Video size={20} />, label: 'Replay Video' },
  ];

  const settingsItems = [
    { href: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <html lang="en">
      <body>
        <div className="admin-layout">
          {/* Sidebar */}
          <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo" style={{ borderBottom: '1px solid var(--sidebar-border)', padding: '0 0 16px', margin: '0 16px 20px', minHeight: 'auto', height: 'auto', overflow: 'visible' }}>
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
            <div className="sidebar-groups">
              {/* Blog Group */}
              <div>
                {!collapsed && <div className="sidebar-group-label">Blog</div>}
                <ul className="nav-menu">
                  {blogItems.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                        title={collapsed ? item.label : undefined}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Marketing Group */}
              <div>
                {!collapsed && <div className="sidebar-group-label with-divider">Marketing</div>}
                {collapsed && <div className="sidebar-group-divider"></div>}
                <ul className="nav-menu">
                  {marketingItems.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                        title={collapsed ? item.label : undefined}
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
                {!collapsed && <div className="sidebar-group-label with-divider">System</div>}
                {collapsed && <div className="sidebar-group-divider"></div>}
                <ul className="nav-menu">
                  {settingsItems.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                        title={collapsed ? item.label : undefined}
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
            <div className="sidebar-footer">
              <ul className="nav-menu">
                <li>
                  <a
                    href="/api/auth/logout"
                    className="nav-item nav-item-danger"
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
              <div className="topbar-title">
                Blog Management System
              </div>
              <div className="topbar-account">
                <span className="topbar-account-name">{accountLabel}</span>
                <div className="topbar-avatar">
                  {accountLabel.charAt(0).toUpperCase()}
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
