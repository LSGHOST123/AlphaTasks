
import React, { useState } from 'react';
import { db } from '../db';
import { Payment } from '../types';
import { 
  Plus, 
  DollarSign, 
  Search, 
  Filter, 
  Calendar,
  FileText,
  Download,
  Trash2,
  X,
  CreditCard,
  PieChart
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Payments() {
  const [data, setData] = useState(db.getData());
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  const [formData, setFormData] = useState({
    clientId: '',
    amount: 0,
    invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'unpaid' as 'paid' | 'unpaid'
  });

  const filteredPayments = data.payments.filter(p => 
    statusFilter === 'all' ? true : p.status === statusFilter
  );

  const totalRevenue = data.payments
    .filter(p => p.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingRevenue = data.payments
    .filter(p => p.status === 'unpaid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.addPayment({
      id: crypto.randomUUID(),
      userId: data.user?.id || '1',
      ...formData,
    });
    setData(db.getData());
    setShowModal(false);
    setFormData({ 
      clientId: '', 
      amount: 0, 
      invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'unpaid'
    });
  };

  const toggleStatus = (payment: Payment) => {
    db.updatePayment({
      ...payment,
      status: payment.status === 'paid' ? 'unpaid' : 'paid'
    });
    setData(db.getData());
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this financial record permanently?')) {
      db.deletePayment(id);
      setData(db.getData());
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">TREASURY <span className="text-[#39ff14]">LOGS</span></h1>
          <p className="text-zinc-500 font-medium mt-1">Cashflow surveillance and financial reporting.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#39ff14] text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg font-black text-xs tracking-widest uppercase"
        >
          <Plus size={18} />
          <span>New Invoice</span>
        </button>
      </header>

      {/* Finance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-[#39ff14]/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(57,255,20,0.05)] relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[#39ff14] text-xs font-black uppercase tracking-widest mb-3 flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#39ff14] mr-2 animate-pulse" />
              TOTAL REVENUE
            </p>
            <h2 className="text-5xl font-black text-white tracking-tighter">${totalRevenue.toLocaleString()}</h2>
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Invoices</span>
                <span className="text-sm font-bold text-white">{data.payments.filter(p => p.status === 'paid').length} COLLECTED</span>
              </div>
            </div>
          </div>
          <DollarSign size={160} className="absolute -right-16 -bottom-16 text-[#39ff14]/5 group-hover:scale-110 transition-transform duration-1000" />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-3 flex items-center">
              <span className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
              PENDING ASSETS
            </p>
            <h2 className="text-5xl font-black text-white tracking-tighter">${pendingRevenue.toLocaleString()}</h2>
          </div>
          <div className="mt-8">
             <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                <div 
                  className="h-full bg-[#39ff14] rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]" 
                  style={{ width: `${(totalRevenue / (totalRevenue + pendingRevenue + 1)) * 100}%` }} 
                />
             </div>
             <div className="flex justify-between mt-3 text-[10px] font-black uppercase tracking-widest text-zinc-600">
               <span>Liquidity Ratio</span>
               <span>Efficiency: {Math.round((totalRevenue / (totalRevenue + pendingRevenue + 1)) * 100)}%</span>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-zinc-900/50">
          <div className="flex p-1 bg-zinc-800 rounded-xl space-x-1 border border-zinc-700">
            {(['all', 'unpaid', 'paid'] as const).map(f => (
              <button 
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === f 
                    ? 'bg-zinc-700 text-[#39ff14] shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Filter ledger..."
              className="pl-12 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm outline-none w-full text-white font-medium focus:ring-1 focus:ring-[#39ff14]/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">ID</th>
                <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Entity</th>
                <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredPayments.length > 0 ? (
                filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-zinc-800/30 transition-all group">
                    <td className="px-8 py-6 font-black text-[#39ff14] group-hover:neon-text">
                      {payment.invoiceNumber}
                    </td>
                    <td className="px-8 py-6 text-zinc-300 font-bold">
                      {data.clients.find(c => c.id === payment.clientId)?.name || 'Direct Ledger'}
                    </td>
                    <td className="px-8 py-6 text-zinc-500 font-medium text-xs">
                      {format(parseISO(payment.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-8 py-6 font-black text-white">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleStatus(payment)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase transition-all border ${
                          payment.status === 'paid' 
                            ? 'bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/20' 
                            : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                        }`}
                      >
                        {payment.status}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg">
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(payment.id)}
                          className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-zinc-700">
                    <PieChart size={48} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">No transaction records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h3 className="font-black text-xl text-white tracking-tight uppercase">Generate <span className="text-[#39ff14]">Invoice</span></h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Voucher ID</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-black tracking-widest opacity-50 cursor-not-allowed"
                  value={formData.invoiceNumber}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Billed Entity</label>
                <select 
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#39ff14] outline-none text-white font-medium"
                  value={formData.clientId}
                  onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                >
                  <option value="">Select Target Client...</option>
                  {data.clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Asset Value ($)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#39ff14] outline-none text-white font-medium"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Timestamp</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#39ff14] outline-none text-white font-medium"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Payment Status</label>
                <div className="flex space-x-3">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, status: 'unpaid'})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      formData.status === 'unpaid' 
                        ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' 
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}
                  >
                    Unpaid
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, status: 'paid'})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      formData.status === 'paid' 
                        ? 'bg-[#39ff14] text-black border-[#39ff14] shadow-lg shadow-[#39ff14]/20' 
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}
                  >
                    Paid
                  </button>
                </div>
              </div>
              
              <div className="pt-6 flex space-x-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 border border-zinc-700 rounded-xl text-zinc-400 font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all"
                >
                  ABORT
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-[#39ff14] text-black rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  DEPLOY VOUCHER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
