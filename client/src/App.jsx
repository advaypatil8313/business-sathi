import { Navigate, Route, Routes } from 'react-router-dom';
import { useBusiness } from './hooks/useBusiness.js';
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AssistantWorkspace from './pages/AssistantWorkspace.jsx';
import BusinessData from './pages/BusinessData.jsx';
import AppShell from './components/layout/AppShell.jsx';
import Logo from './components/ui/Logo.jsx';

export default function App() {
  const { business, loading, setBusiness } = useBusiness();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-canvas text-sm text-muted">
        <Logo markClassName="text-accent" textClassName="text-ink" />
        <p>Loading Business Sathi…</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/onboarding"
        element={<Onboarding onDone={setBusiness} />}
      />
      <Route
        element={business ? <AppShell business={business} /> : <Navigate to="/onboarding" replace />}
      >
        <Route path="/dashboard" element={<Dashboard business={business} />} />
        <Route path="/assistant/:key" element={<AssistantWorkspace />} />
        <Route path="/business-data" element={<BusinessData />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={business ? '/dashboard' : '/onboarding'} replace />}
      />
    </Routes>
  );
}
