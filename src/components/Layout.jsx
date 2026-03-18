import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar__brand">Wonder</div>
        <nav className="sidebar__nav">
          <NavLink to="/orders/new" className="sidebar__link">
            ➕ Nuevo Pedido
          </NavLink>
          <NavLink to="/orders" end className="sidebar__link">
            📋 Gestión Pedidos
          </NavLink>
          <NavLink to="/products" className="sidebar__link">
            🍔 Productos
          </NavLink>
          <NavLink to="/board" className="sidebar__link">
            📺 Pantalla
          </NavLink>
        </nav>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
