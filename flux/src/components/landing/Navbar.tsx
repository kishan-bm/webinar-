import { useState } from "react";

const NAV_CSS = `
  .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 900; padding: 18px 60px; display: flex; align-items: center; justify-content: space-between; transition: background 0.4s, box-shadow 0.4s, padding 0.3s; }
  .navbar.scrolled { background: rgba(13,46,78,0.98); backdrop-filter: blur(20px); padding: 12px 60px; box-shadow: 0 4px 30px rgba(0,0,0,0.2); }
  .nav-logo { display: flex; align-items: center; text-decoration: none; }
  .nav-logo img { height: 40px; width: auto; transform: scale(5); transform-origin: left center; }
  .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
  .nav-links a { color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 500; text-decoration: none; transition: color 0.2s; }
  .nav-links a:hover, .nav-links a.active { color: #c8420a !important; font-weight: 700; }
  .nav-item-dropdown { position: relative; }
  .nav-item-dropdown > a { display: flex; align-items: center; gap: 4px; }
  .nav-chevron { font-size: 9px; transition: transform 0.25s; opacity: 0.7; }
  .nav-item-dropdown:hover .nav-chevron { transform: rotate(180deg); }
  .dropdown-menu { position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(-6px); background: rgba(7,24,44,0.97); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-top: 2px solid #c8420a; border-radius: 12px; min-width: 215px; padding: 6px; opacity: 0; visibility: hidden; transition: all 0.22s ease; z-index: 200; box-shadow: 0 20px 50px rgba(0,0,0,0.45); pointer-events: none; }
  .dropdown-menu::before { content: ''; position: absolute; top: -20px; left: 0; right: 0; height: 20px; }
  .nav-item-dropdown:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); pointer-events: all; }
  .dropdown-menu a { display: block; padding: 10px 14px; color: rgba(255,255,255,0.8) !important; font-size: 13.5px; font-weight: 500; border-radius: 8px; transition: background 0.18s, color 0.18s; white-space: nowrap; text-decoration: none; }
  .dropdown-menu a:hover { background: rgba(200,66,10,0.18) !important; color: #e86428 !important; }
  .nav-cta { background: #c8420a; color: #fff; padding: 10px 22px; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; border: none; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; transition: all 0.2s; }
  .nav-cta:hover { background: #e04d10; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,66,10,0.35); }
  .nav-toggle { display: none; background: none; border: none; color: #fff; font-size: 26px; line-height: 1; cursor: pointer; padding: 4px 6px; order: -1; }
  .nav-backdrop { display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 998; }
  .nav-backdrop.active { display: block; }
  @media (min-width: 769px) {
    .navbar > .nav-logo { flex: 1 1 0; }
    .navbar > .nav-links { flex: 0 0 auto; }
    .navbar > .nav-auth-group { flex: 1 1 0; display: flex; justify-content: flex-end; align-items: center; }
  }
  @media (max-width: 768px) {
    .navbar, .navbar.scrolled { display: grid !important; grid-template-columns: 1fr 100px 1fr; gap: 0; padding: 12px 16px !important; background: rgba(13,46,78,0.98) !important; backdrop-filter: blur(20px); }
    .nav-toggle { display: flex; align-items: center; grid-column: 1; justify-self: start; }
    .nav-logo { grid-column: 2; margin: 0; }
    .nav-logo img { transform: scale(2.5); transform-origin: center center; }
    .nav-auth-group { grid-column: 3; justify-self: end; overflow: visible; display: flex !important; }
    .nav-cta { padding: 8px 14px; font-size: 13px; white-space: nowrap; }
    .nav-close { display: flex; align-items: center; justify-content: center; position: absolute; top: 20px; right: 20px; width: 36px; height: 36px; border: none; border-radius: 50%; background: rgba(255,255,255,0.12); color: #fff; font-size: 18px; cursor: pointer; line-height: 1; z-index: 10; }
    .nav-close:hover { background: rgba(255,255,255,0.22); }
    .nav-links {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 78%;
      max-width: 320px;
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
      background: rgba(7,24,44,0.98);
      backdrop-filter: blur(20px);
      box-shadow: 10px 0 30px rgba(0,0,0,0.4);
      padding: 90px 24px 18px;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      z-index: 999;
      overflow-y: auto;
    }
    .nav-links.active { transform: translateX(0); }
    .nav-links li { width: 100%; }
    .nav-links a { display: block; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .nav-item-dropdown .dropdown-menu { position: static; box-shadow: none; padding-left: 12px; opacity: 1; visibility: visible; pointer-events: auto; transform: none; background: transparent; backdrop-filter: none; border: none; }
  }
`;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{NAV_CSS}</style>
      <nav className="navbar scrolled">
        <button
          type="button"
          className="nav-toggle"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          &#9776;
        </button>
        <a href="/home" className="nav-logo">
          <img src="/logo.png" alt="NavigationTrading" />
        </a>
        <ul className={`nav-links${open ? " active" : ""}`}>
          <button type="button" className="nav-close" onClick={() => setOpen(false)} aria-label="Close menu">&#x2715;</button>
          <li><a href="/home">Home</a></li>
          <li><a href="/performance">Performance</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li className="nav-item-dropdown">
            <a href="#" className="active">Services <span className="nav-chevron">&#9662;</span></a>
            <div className="dropdown-menu">
              <a href="/free-membership">Free Membership</a>
              <a href="/day-trading-membership">Day Trade Membership</a>
              <a href="/paid-membership">Pro Membership</a>
              <a href="/coaching">Private Coaching</a>
              <a href="#" className="active">Flux</a>
            </div>
          </li>
          <li><a href="/podcast">Podcast</a></li>
          <li><a href="/blogs">Blog</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>
        <div className="nav-auth-group">
          <a href="/pricing" className="nav-cta">Get Trade Alerts</a>
        </div>
        <div
          className={`nav-backdrop${open ? " active" : ""}`}
          onClick={() => setOpen(false)}
        />
      </nav>
    </>
  );
}
