import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const menus = [
  { path: '/board', label: '게시판' },
  { path: '/calendar', label: '캘린더' },
  { path: '/events', label: '일정 관리' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">My App</div>
      <nav>
        {menus.map(m => (
          <NavLink
            key={m.path}
            to={m.path}
            className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}
          >
            {m.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
