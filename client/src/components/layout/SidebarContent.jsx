import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { LayoutGrid, Database } from 'lucide-react';
import { api } from '../../services/api.js';
import { assistantIcons } from '../../assistants/assistantsMeta.js';
import { useOllamaStatus } from '../../hooks/useOllamaStatus.js';
import Logo from '../ui/Logo.jsx';

const navItemClass = ({ isActive }) =>
  `focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    isActive ? 'bg-sidebar-active text-white' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
  }`;

export default function SidebarContent({ business, onNavigate }) {
  const [assistants, setAssistants] = useState([]);
  const { key: activeAssistantKey } = useParams();
  const { ready, checking } = useOllamaStatus();

  useEffect(() => {
    api.getAssistants().then(setAssistants).catch(() => setAssistants([]));
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-6 pt-6">
        <Logo textClassName="text-white" markClassName="text-accent" />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        <div className="space-y-1">
          <NavLink to="/dashboard" className={navItemClass} onClick={onNavigate}>
            <LayoutGrid size={17} strokeWidth={1.9} />
            Dashboard
          </NavLink>
          <NavLink to="/business-data" className={navItemClass} onClick={onNavigate}>
            <Database size={17} strokeWidth={1.9} />
            Business Data
          </NavLink>
        </div>

        <div>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-text/70">
            Your AI Team
          </p>
          <div className="space-y-1">
            {assistants.map((a) => {
              const Icon = assistantIcons[a.key];
              const isActive = a.key === activeAssistantKey;
              return (
                <NavLink
                  key={a.key}
                  to={`/assistant/${a.key}`}
                  onClick={onNavigate}
                  className={navItemClass}
                >
                  {Icon && <Icon size={17} strokeWidth={1.9} />}
                  <span className="truncate">{a.name}</span>
                  {isActive && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-sidebar-line px-5 py-4">
        <div className="mb-3 flex items-center gap-2 text-xs text-sidebar-text">
          <span
            className={`h-1.5 w-1.5 rounded-full ${checking ? 'bg-sidebar-text' : ready ? 'bg-accent' : 'bg-amber-400'}`}
            aria-hidden="true"
          />
          {checking ? 'Checking AI status…' : ready ? 'AI team ready' : 'AI team unavailable'}
        </div>
        {business && (
          <div className="rounded-xl bg-sidebar-hover px-3 py-2.5">
            <p className="truncate text-sm font-medium text-white">{business.name}</p>
            <p className="truncate text-xs text-sidebar-text">{business.type}</p>
          </div>
        )}
      </div>
    </div>
  );
}
