import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, User, Bell, Bookmark, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  const profilePath = currentUser ? `/profile/${currentUser.username}` : '/profile/currentUser';

  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="logo">
        Nexus
      </NavLink>

      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>

        <NavLink to={profilePath} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>

        <NavLink to="/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Bell size={24} />
          <span>Notifications</span>
        </NavLink>

        <NavLink to="/bookmarks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Bookmark size={24} />
          <span>Bookmarks</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Settings size={24} />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="nav-link logout-btn"
          style={{
            marginTop: '2rem',
            color: 'var(--danger)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <LogOut size={24} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
