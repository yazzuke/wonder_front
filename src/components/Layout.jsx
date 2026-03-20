import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar__brand">Wonder</div>
        <nav className="sidebar__nav">
          <NavLink to="/orders/new" className="sidebar__link">
            ➕ New Order
          </NavLink>
          <NavLink to="/orders" end className="sidebar__link">
            📋 Manage Orders
          </NavLink>
          <NavLink to="/products" className="sidebar__link">
            🍔 Products
          </NavLink>
          <NavLink to="/menu-items" className="sidebar__link">
            📜 Menu Items
          </NavLink>
          <NavLink to="/board" className="sidebar__link">
            📺 Display
          </NavLink>
        </nav>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
