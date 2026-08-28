import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SidebarContent from './SidebarContent.jsx';
import OllamaStatusBanner from '../OllamaStatusBanner.jsx';
import Logo from '../ui/Logo.jsx';

export default function AppShell({ business }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-canvas lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-sidebar lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent business={business} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden">
        <Logo markClassName="text-accent" textClassName="text-ink" />
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-ink hover:bg-canvas"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80%] bg-sidebar shadow-pop">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
              className="focus-ring absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-text hover:bg-sidebar-hover hover:text-white"
            >
              <X size={18} />
            </button>
            <SidebarContent business={business} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
          <OllamaStatusBanner />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
