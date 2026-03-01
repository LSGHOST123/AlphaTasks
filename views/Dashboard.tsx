
import React, { useMemo } from 'react';
import { db } from '../db';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  ArrowUpRight,
  ChevronRight,
  Bell,
  Activity
} from 'lucide-react';
import { isToday, isBefore, addDays, parseISO, format } from 'date-fns';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, subtext, icon: Icon, active }: any) => (
  <div className={`p-6 rounded-2xl border transition-all ${
    active 
      ? 'bg-zinc-900 border-[#39ff14] shadow-[0_0_20px_rgba(57,255,20,0.1)]' 
      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
  }`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white">{value}</h3>
        <p className="text-xs text-zinc-500 mt-2">{subtext}</p>
      </div>
      <div className={`p-3 rounded-xl ${active ? 'bg-[#39ff14] text-black shadow-[0_0_15px_rgba(57,255,20,0.5)]' : 'bg-zinc-800 text-zinc-400'}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const data = db.getData();
  const tasks = data.tasks;
  const payments = data.payments;

  const stats = useMemo(() => {
    const todayTasks = tasks.filter(t => t.status !== 'completed' && isToday(parseISO(t.deadline)));
    const overdueTasks = tasks.filter(t => t.status !== 'completed' && isBefore(parseISO(t.deadline), new Date()) && !isToday(parseISO(t.deadline)));
    const upcomingTasks = tasks.filter(t => {
      const deadline = parseISO(t.deadline);
      return t.status !== 'completed' && isBefore(deadline, addDays(new Date(), 7)) && !isBefore(deadline, new Date());
    });
    
    const pendingPayments = payments.filter(p => p.status === 'unpaid');
    const totalPendingAmount = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      today: todayTasks,
      overdue: overdueTasks,
      upcoming: upcomingTasks,
      pendingCount: pendingPayments.length,
      totalPending: totalPendingAmount
    };
  }, [tasks, payments]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 slide-in-from-bottom-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
            WELCOME, <span className="text-[#39ff14] neon-text">{data.user?.name.toUpperCase()}</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium">Your freelance empire is looking sharp today.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/tasks" className="px-6 py-3 bg-[#39ff14] text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] font-bold text-sm">
            CREATE TASK
          </Link>
        </div>
      </header>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Daily Grind" 
          value={stats.today.length} 
          subtext="Due today" 
          icon={Clock} 
          active={stats.today.length > 0}
        />
        <StatCard 
          title="Urgent" 
          value={stats.overdue.length} 
          subtext="Needs attention" 
          icon={AlertCircle} 
          active={stats.overdue.length > 0}
        />
        <StatCard 
          title="Roadmap" 
          value={stats.upcoming.length} 
          subtext="Coming this week" 
          icon={Activity} 
          active={false}
        />
        <StatCard 
          title="Bankroll" 
          value={`$${stats.totalPending.toLocaleString()}`} 
          subtext="Pending collection" 
          icon={DollarSign} 
          active={stats.totalPending > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col - Tasks */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="font-black text-white text-lg tracking-tight">CRITICAL PATH</h2>
              <Link to="/tasks" className="text-[#39ff14] hover:text-white text-xs font-black tracking-widest uppercase flex items-center transition-colors">
                VIEW ALL <ArrowUpRight size={14} className="ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-zinc-800">
              {stats.overdue.concat(stats.today).length > 0 ? (
                stats.overdue.concat(stats.today).slice(0, 5).map(task => (
                  <div key={task.id} className="px-8 py-5 flex items-center justify-between hover:bg-zinc-800/50 transition-all group cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${stats.overdue.find(o => o.id === task.id) ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.5)]'}`} />
                      <div>
                        <p className="font-bold text-white group-hover:text-[#39ff14] transition-colors">{task.title}</p>
                        <p className="text-xs text-zinc-500 font-medium">
                          {data.clients.find(c => c.id === task.clientId)?.name || 'Direct'} • {format(parseISO(task.deadline), 'MMM d')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                      task.priority === 'high' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                      task.priority === 'medium' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-16 text-center text-zinc-600">
                  <CheckCircle2 size={48} className="mx-auto text-zinc-800 mb-4" />
                  <p className="font-bold">Zero alerts. You're efficient.</p>
                </div>
              )}
            </div>
          </section>

          {/* Recently Added Clients */}
          <section className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="font-black text-white text-lg tracking-tight">VIP ROSTER</h2>
              <Link to="/clients" className="text-[#39ff14] hover:text-white text-xs font-black tracking-widest uppercase transition-colors">SEE ALL</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-8">
              {data.clients.length > 0 ? (
                data.clients.slice(-4).reverse().map(client => (
                  <div key={client.id} className="p-5 bg-zinc-800/50 border border-zinc-700 rounded-2xl flex items-center space-x-4 hover:border-[#39ff14]/50 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center text-[#39ff14] font-black border border-zinc-600 shadow-lg">
                      {client.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-white text-sm truncate">{client.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{client.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-10 text-center text-zinc-700 italic text-sm">
                  Add your first high-ticket client.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Col - Payments / Notifications */}
        <div className="space-y-8">
          <section className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/50">
              <h2 className="font-black text-white text-lg tracking-tight uppercase">CASH FLOW</h2>
            </div>
            <div className="p-8">
              {data.payments.filter(p => p.status === 'unpaid').length > 0 ? (
                <ul className="space-y-6">
                  {data.payments.filter(p => p.status === 'unpaid').slice(0, 5).map(payment => (
                    <li key={payment.id} className="flex justify-between items-center group">
                      <div>
                        <p className="text-sm font-black text-white group-hover:text-[#39ff14] transition-colors">{payment.invoiceNumber}</p>
                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-tighter">{data.clients.find(c => c.id === payment.clientId)?.name}</p>
                      </div>
                      <p className="font-black text-[#39ff14]">${payment.amount}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-zinc-700 text-sm py-4">No unpaid invoices. Scaling well.</p>
              )}
              <Link to="/payments" className="block text-center mt-8 w-full py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-black tracking-widest text-zinc-300 hover:text-[#39ff14] hover:border-[#39ff14] transition-all uppercase">
                FINANCIAL CENTER
              </Link>
            </div>
          </section>

          <section className="bg-[#39ff14] rounded-3xl shadow-[0_0_30px_rgba(57,255,20,0.2)] p-8 text-black relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-black text-[#39ff14] rounded-xl">
                  <Bell size={20} />
                </div>
                <h3 className="font-black text-xl uppercase tracking-tighter">System Intel</h3>
              </div>
              <p className="text-black font-bold text-sm leading-relaxed mb-6">
                The AlphaTasks platform is optimized for speed. Ensure your project deadlines are set for the quarter.
              </p>
              <button className="w-full py-3 bg-black text-[#39ff14] rounded-xl text-xs font-black tracking-widest uppercase hover:scale-105 transition-transform shadow-lg">
                Optimization Docs
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-black opacity-5 rounded-full" />
          </section>
        </div>
      </div>
    </div>
  );
}
