const NAV_CSS = `
  .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 900; padding: 18px 60px; display: flex; align-items: center; justify-content: space-between; transition: background 0.4s, box-shadow 0.4s, padding 0.3s; }
  .navbar.scrolled { background: rgba(13,46,78,0.98); backdrop-filter: blur(20px); padding: 12px 60px; box-shadow: 0 4px 30px rgba(0,0,0,0.2); }
  .nav-logo { display: flex; align-items: center; text-decoration: none; }
  .nav-logo img { height: 40px; width: auto; transform: scale(5); transform-origin: left center; }
  .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
  .nav-links a { color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 500; text-decoration: none; transition: color 0.2s; }
  .nav-links a:hover, .nav-links a.active { color: var(--orange) !important; font-weight: 700; }
  .nav-item-dropdown { position: relative; }
  .nav-item-dropdown > a { display: flex; align-items: center; gap: 4px; }
  .nav-chevron { font-size: 9px; transition: transform 0.25s; opacity: 0.7; }
  .nav-item-dropdown:hover .nav-chevron { transform: rotate(180deg); }
  .dropdown-menu { position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(-6px); background: rgba(7,24,44,0.97); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-top: 2px solid var(--orange); border-radius: 12px; min-width: 215px; padding: 6px; opacity: 0; visibility: hidden; transition: all 0.22s ease; z-index: 200; box-shadow: 0 20px 50px rgba(0,0,0,0.45); pointer-events: none; }
  .dropdown-menu::before { content: ''; position: absolute; top: -20px; left: 0; right: 0; height: 20px; }
  .nav-item-dropdown:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); pointer-events: all; }
  .dropdown-menu a { display: block; padding: 10px 14px; color: rgba(255,255,255,0.8) !important; font-size: 13.5px; font-weight: 500; border-radius: 8px; transition: background 0.18s, color 0.18s; white-space: nowrap; text-decoration: none; }
  .dropdown-menu a:hover { background: rgba(200,66,10,0.18) !important; color: #e86428 !important; }
  .nav-cta { background: var(--orange); color: #fff; padding: 10px 22px; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; border: none; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; transition: all 0.2s; }
  .nav-cta:hover { background: var(--orange-bright); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,66,10,0.35); }
  @media (max-width: 768px) {
    .navbar { padding: 14px 24px; }
    .nav-links { display: none; }
  }
`;

export function Navbar() {
  return (
    <>
      <style>{NAV_CSS}</style>
      <nav className="navbar scrolled">
        <a href="/home" className="nav-logo">
          <img src="/logo.png" alt="NavigationTrading" />
        </a>
        <ul className="nav-links">
          <li><a href="/home">Home</a></li>
          <li><a href="/performance">Performance</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li className="nav-item-dropdown">
            <a href="#">Services <span className="nav-chevron">&#9662;</span></a>
            <div className="dropdown-menu">
              <a href="/free-membership">Free Membership</a>
              <a href="/day-trading-membership">Day Trade Membership</a>
              <a href="/paid-membership">Pro Membership</a>
              <a href="/coaching">Private Coaching</a>
              <a href="/flux" className="active">Flux</a>
            </div>
          </li>
          <li><a href="/podcast">Podcast</a></li>
          <li><a href="/blogs">Blog</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>
        <a href="/pricing" className="nav-cta">Get Trade Alerts</a>
      </nav>
    </>
  );
}
