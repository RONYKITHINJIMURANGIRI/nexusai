import { useState } from 'react';
import { MessagesSquare, Search, Database, Layers, Settings, Home, User, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'chat', label: 'Chat', icon: MessagesSquare },
  { id: 'knowledge', label: 'Knowledge', icon: Database },
  { id: 'memory', label: 'Memory', icon: Search },
  { id: 'models', label: 'Models', icon: Layers },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'users', label: 'Users', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function Sidebar({ activePage, onNavigate }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className="sidebar" style={{ width: isCollapsed ? 60 : 250, transition: 'width 0.2s' }}>
      <div className="brand">
        <div className="brand-mark">N</div>
        <div>
          <strong>NexusAI</strong>
          <p>AI workspace</p>
        </div>
      </div>
      <nav className="nav-list">
        {navItems.map(({ id, label, icon: Icon }, index) => (
          <>
            {index > 0 && index % 3 === 0 && <div className="nav-separator" key={`sep-${index}`} />}
            <button
              key={id}
              className={`nav-item ${activePage === id ? 'active' : ''}`}
              onClick={() => onNavigate(id)}
              type="button"
            >
              <Icon size={18} />
              {!isCollapsed && <span>{label}</span>}
            </button>
          </>
        ))}
      </nav>
      <div className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)} style={{ padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </div>
    </aside>
  );
}

export default Sidebar;