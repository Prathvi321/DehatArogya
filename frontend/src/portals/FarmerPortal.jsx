import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, QrCode, AlertTriangle, ArrowRight, PlusCircle, History } from 'lucide-react';
import PortalShell from './PortalShell';

const cards = [
  { to: '/farmer/register', title: 'Register Animal', text: 'Create a lifetime livestock identity and generate a printable QR ear tag.', icon: PlusCircle },
  { to: '/scan', title: 'Scan Animal Tag', text: 'Scan a tag to verify the animal, report symptoms, and view its medical history.', icon: QrCode },
  { to: '/farmer/animals', title: 'My Animals', text: 'See registered animals, active concerns, previous treatment, and QR tags.', icon: PawPrint },
];

export default function FarmerPortal() {
  return (
    <PortalShell role="farmer">
      <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-700 to-slate-900 text-white p-6 sm:p-8 mb-6">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Farmer / Livestock Owner</div>
          <h1 className="text-3xl sm:text-4xl font-black mt-2">Your animal health records, in one place.</h1>
          <p className="mt-3 text-emerald-50/85 text-sm sm:text-base leading-relaxed">Register animals, print QR tags, raise health concerns with text or voice, and reopen the complete treatment history from any tag.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/farmer/register" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-sm">Register Animal <ArrowRight className="w-4 h-4" /></Link>
          <Link to="/scan" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 font-bold text-sm">Scan Tag <QrCode className="w-4 h-4" /></Link>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map(({ to, title, text, icon: Icon }) => (
          <Link key={to} to={to} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center"><Icon className="w-5 h-5" /></div>
            <h2 className="font-black mt-4">{title}</h2>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{text}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 font-bold"><AlertTriangle className="w-4 h-4 text-amber-600" /> Raise a Concern</div>
          <p className="text-sm text-slate-500 mt-2">After scanning a tag, describe the symptoms in Hindi, Hinglish, or English, attach evidence, and share the case with the veterinary team.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 font-bold"><History className="w-4 h-4 text-teal-700" /> Medical History</div>
          <p className="text-sm text-slate-500 mt-2">Each animal keeps a chronological ledger of reported issues, AI triage, veterinary notes, and treatment status.</p>
        </div>
      </div>
    </PortalShell>
  );
}
