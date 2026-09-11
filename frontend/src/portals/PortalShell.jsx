import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Stethoscope, QrCode, PawPrint, ClipboardList, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function PortalShell({ role, children }) {
  const location = useLocation();
  const farmer = role === 'farmer';
  const links = farmer
    ? [
        { to: '/farmer', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/farmer/register', label: 'Register Animal', icon: PlusCircle },
        { to: '/farmer/animals', label: 'My Animals', icon: PawPrint },
        { to: '/scan', label: 'Scan Tag', icon: QrCode },
      ]
    : [
        { to: '/doctor', label: 'Cases', icon: ClipboardList },
        { to: '/doctor/registry', label: 'Animal Registry', icon: PawPrint },
      ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link to={farmer ? '/farmer' : '/doctor'} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl grid place-items-center text-white ${farmer ? 'bg-emerald-600' : 'bg-teal-800'}`}>
              {farmer ? <HeartPulse className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-black tracking-tight text-lg">DehatArogya</div>
              <div className="text-[11px] text-slate-500">{farmer ? 'Farmer & Livestock Health Portal' : 'Veterinary Doctor Portal'}</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {links.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to || (to !== '/farmer' && to !== '/doctor' && location.pathname.startsWith(to));
              return (
                <Link key={to} to={to} className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap ${active ? (farmer ? 'bg-emerald-600 text-white' : 'bg-teal-800 text-white') : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  );
}
