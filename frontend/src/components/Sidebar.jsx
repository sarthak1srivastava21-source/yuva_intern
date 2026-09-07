import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Bell, Bookmark, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="logo">
        Nexus
      </NavLink>

      <nav>
        <NavLink to="/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        
        <NavLink to="/profile/currentUser" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>
        
        <NavLink to="/notifications" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Bell size={24} />
          <span>Notifications</span>
        </NavLink>
        
        <NavLink to="/bookmarks" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Bookmark size={24} />
          <span>Bookmarks</span>
        </NavLink>
        
        <NavLink to="/settings" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Settings size={24} />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/" className="nav-link" style={{ marginTop: '2rem', color: 'var(--danger)' }}>
          <LogOut size={24} />
          <span>Logout</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
