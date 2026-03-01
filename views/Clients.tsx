
import React, { useState } from 'react';
import { db } from '../db';
import { Client } from '../types';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Mail, 
  Phone, 
  Trash2, 
  Edit,
  UserPlus,
  Users,
  X,
  AlertTriangle
} from 'lucide-react';

export default function Clients() {
  const [data, setData] = useState(db.getData());
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const filteredClients = data.clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        notes: client.notes
      });
    } else {
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', notes: '' });
    }
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      db.updateClient({ ...editingClient, ...formData });
    } else {
      db.addClient({
        id: crypto.randomUUID(),
        userId: data.user?.id || '1',
        ...formData,
        createdAt: new Date().toISOString()
      });
    }
    setData(db.getData());
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('⚠️ WARNING: Delete this client? This will permanently wipe all associated projects and invoices.')) {
      db.deleteClient(id);
      setData(db.getData());
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">CLIENT <span className="text-[#39ff14]">INTEL</span></h1>
          <p className="text-zinc-500 font-medium mt-1">Manage your professional network and contacts.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#39ff14] text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg font-black text-xs tracking-widest uppercase"
        >
          <UserPlus size={18} />
          <span>Add Client</span>
        </button>
      </header>

      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 flex items-center bg-zinc-900/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Filter database..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#39ff14]/50 focus:border-[#39ff14] outline-none transition-all text-sm font-medium text-white placeholder-zinc-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-900/80 border-b border-zinc-800">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Ident</th>
                <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Comm Channels</th>
                <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-zinc-800/30 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-[#39ff14] font-black border border-zinc-700 group-hover:border-[#39ff14] transition-colors">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-base">{client.name}</p>
                          <p className="text-xs text-zinc-500 font-medium">EST. {new Date(client.createdAt).toLocaleDateString().toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-zinc-300 font-medium">
                          <Mail size={14} className="mr-3 text-zinc-600" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm text-zinc-300 font-medium">
                          <Phone size={14} className="mr-3 text-zinc-600" />
                          {client.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20">
                        Active Ops
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => handleOpenModal(client)}
                          className="p-2.5 text-zinc-500 hover:text-[#39ff14] hover:bg-zinc-800 rounded-xl transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(client.id)}
                          className="p-2.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Users size={48} className="mx-auto text-zinc-800 mb-4" />
                    <p className="text-zinc-600 font-bold tracking-tight">Database empty. Populate your client roster.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h3 className="font-black text-xl text-white tracking-tight uppercase">
                {editingClient ? 'Recalibrate' : 'Deploy'} <span className="text-[#39ff14]">Client</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Protocol Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#39ff14] outline-none text-white font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Official Client Entity"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">E-Mail</label>
                  <input 
                    required
                    type="email" 
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#39ff14] outline-none text-white font-medium"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="hq@agency.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Mobile</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#39ff14] outline-none text-white font-medium"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1-000-ALPHA"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Operational Briefing</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#39ff14] outline-none text-white font-medium resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Key details and project specifics..."
                />
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
                  SAVE DATA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
