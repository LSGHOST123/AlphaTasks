
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { db } from './db';
import { User } from './types';

// Views
import Dashboard from './views/Dashboard';
import Clients from './views/Clients';
import Tasks from './views/Tasks';
import Payments from './views/Payments';
import Auth from './views/Auth';

interface NavItemProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-[#39ff14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]' 
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-[#39ff14]'
    }`}
  >
    <Icon size={20} />
    <span className="font-semibold">{label}</span>
  </Link>
);

interface AppLayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clients', icon: Users, label: 'Clients' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/payments', icon: CreditCard, label: 'Payments' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const confirmLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen flex bg-[#09090b] text-zinc-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-[#09090b] border-r border-zinc-800 p-6 fixed inset-y-0">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-[#39ff14] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.5)]">
            <CheckSquare size={24} className="text-black" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-[#39ff14]">ALPHA <span className="text-white">TASKS</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navLinks.map(link => (
            <NavItem 
              key={link.to} 
              to={link.to} 
              icon={link.icon} 
              label={link.label} 
              active={location.pathname === link.to} 
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-zinc-800 mt-auto">
          <div className="flex items-center space-x-3 px-4 py-4 mb-4 bg-zinc-900 rounded-2xl border border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-[#39ff14]/20 flex items-center justify-center text-[#39ff14] font-bold border border-[#39ff14]/30">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={confirmLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-zinc-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between w-full bg-[#09090b] border-b border-zinc-800 p-4 fixed top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#39ff14] rounded-lg flex items-center justify-center">
            <CheckSquare size={18} className="text-black" />
          </div>
          <span className="font-black text-[#39ff14]">ALPHA</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-400">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#09090b] pt-20 px-6 animate-in fade-in slide-in-from-top">
          <nav className="space-y-4">
            {navLinks.map(link => (
              <div key={link.to} onClick={() => setIsMobileMenuOpen(false)}>
                <NavItem 
                  to={link.to} 
                  icon={link.icon} 
                  label={link.label} 
                  active={location.pathname === link.to} 
                />
              </div>
            ))}
            <button 
              onClick={confirmLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-red-400 bg-red-500/10 rounded-xl"
            >
              <LogOut size={20} />
              <span className="font-semibold">Sign Out</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 p-4 md:p-10 pt-24 md:pt-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = db.getData();
    if (data.user) {
      setUser(data.user);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    db.setUser(userData);
    setUser(userData);
  };

  const handleLogout = () => {
    db.setUser(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39ff14]"></div>
      </div>
    );
  }

  return (
    <HashRouter basename="/">
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Auth onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/*" 
          element={
            user ? (
              <AppLayout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/settings" element={
                    <div className="p-10 text-center bg-zinc-900 rounded-3xl border border-zinc-800">
                      <h2 className="text-2xl font-bold text-[#39ff14]">Settings</h2>
                      <p className="text-zinc-400 mt-2">Personalize your experience.</p>
                      <div className="mt-10 max-w-md mx-auto space-y-4">
                        <div className="p-4 bg-zinc-800 rounded-xl border border-zinc-700 flex justify-between items-center text-left">
                          <div>
                            <p className="font-bold">Dark Mode</p>
                            <p className="text-xs text-zinc-500">Always active (Alpha preset)</p>
                          </div>
                          <div className="w-10 h-6 bg-[#39ff14] rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
                          </div>
                        </div>
                        <div className="p-4 bg-zinc-800 rounded-xl border border-zinc-700 flex justify-between items-center text-left">
                          <div>
                            <p className="font-bold">Notifications</p>
                            <p className="text-xs text-zinc-500">Email and push enabled</p>
                          </div>
                          <div className="w-10 h-6 bg-[#39ff14] rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  } />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </HashRouter>
  );
}
