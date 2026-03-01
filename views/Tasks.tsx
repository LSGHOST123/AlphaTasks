
import React, { useState } from 'react';
import { db } from '../db';
import { Task, Priority, TaskStatus } from '../types';
import { 
  Plus, 
  Calendar, 
  Flag, 
  Filter, 
  CheckCircle2, 
  Circle,
  Clock,
  Trash2,
  X,
  Target
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Tasks() {
  const [data, setData] = useState(db.getData());
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    deadline: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium' as Priority
  });

  const filteredTasks = data.tasks.filter(t => 
    statusFilter === 'all' ? true : t.status === statusFilter
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.addTask({
      id: crypto.randomUUID(),
      userId: data.user?.id || '1',
      ...formData,
      status: 'todo',
      createdAt: new Date().toISOString()
    });
    setData(db.getData());
    setShowModal(false);
    setFormData({ ...formData, title: '', description: '', clientId: '' });
  };

  const toggleStatus = (task: Task) => {
    const nextStatusMap: Record<TaskStatus, TaskStatus> = {
      'todo': 'in_progress',
      'in_progress': 'completed',
      'completed': 'todo',
      'overdue': 'completed'
    };
    db.updateTask({ ...task, status: nextStatusMap[task.status] });
    setData(db.getData());
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Confirm deletion: Remove this task objective?')) {
      db.deleteTask(id);
      setData(db.getData());
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="text-[#39ff14]" size={20} />;
      case 'in_progress': return <Clock className="text-orange-500" size={20} />;
      default: return <Circle className="text-zinc-600" size={20} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">MISSION <span className="text-[#39ff14]">OBJECTIVES</span></h1>
          <p className="text-zinc-500 font-medium mt-1">Operational tasks and milestone tracking.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#39ff14] text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg font-black text-xs tracking-widest uppercase"
        >
          <Plus size={18} />
          <span>New Mission</span>
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {['all', 'todo', 'in_progress', 'completed'].map(f => (
          <button 
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              statusFilter === f 
                ? 'bg-[#39ff14] text-black border-[#39ff14] shadow-[0_0_15px_rgba(57,255,20,0.3)]' 
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-zinc-900 p-7 rounded-3xl border border-zinc-800 flex flex-col justify-between group hover:border-zinc-700 transition-all shadow-xl">
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <button 
                    onClick={() => toggleStatus(task)}
                    className="hover:scale-110 transition-transform p-1 rounded-lg bg-zinc-800/50 border border-zinc-700 group-hover:border-[#39ff14]/30"
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  <div className="flex space-x-1 items-center">
                    <span className={`text-[9px] px-2.5 py-0.5 rounded-lg font-black uppercase tracking-widest border ${
                      task.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 
                      task.priority === 'medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/20 shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                    }`}>
                      {task.priority}
                    </span>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 text-zinc-700 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className={`font-black text-lg text-white leading-tight mb-2 ${task.status === 'completed' ? 'line-through text-zinc-600' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium line-clamp-3 leading-relaxed">{task.description}</p>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  <Calendar size={12} className="mr-2" />
                  {format(parseISO(task.deadline), 'MMM d, yyyy')}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#39ff14] bg-[#39ff14]/5 px-2 py-1 rounded">
                  {data.clients.find(c => c.id === task.clientId)?.name || 'Internal'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
            <Target size={64} className="mx-auto text-zinc-800 mb-6" />
            <p className="text-zinc-600 font-black uppercase tracking-widest text-xs">No active targets detected.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h3 className="font-black text-xl text-white tracking-tight uppercase">New <span className="text-[#39ff14]">Mission</span></h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Objective Title</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#39ff14] outline-none text-white font-medium"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="What is the goal?"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Assigned Client</label>
                  <select 
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#39ff14] outline-none text-white font-medium appearance-none"
                    value={formData.clientId}
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                  >
                    <option value="">INTERNAL OPS</option>
                    {data.clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Final Deadline</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#39ff14] outline-none text-white font-medium"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Priority Protocol</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as Priority[]).map(p => (
                    <button 
                      key={p}
                      type="button"
                      onClick={() => setFormData({...formData, priority: p})}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        formData.priority === p 
                          ? 'bg-[#39ff14] text-black border-[#39ff14] shadow-lg' 
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:bg-zinc-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Briefing</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#39ff14] outline-none text-white font-medium resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the mission parameters..."
                />
              </div>
              <div className="pt-6 flex space-x-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 border border-zinc-700 rounded-xl text-zinc-400 font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-[#39ff14] text-black rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  INITIATE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
