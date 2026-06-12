import { AdminLayout as Layout } from "@/components/admin-layout";
import { useGetAdminStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, Gamepad2, Coins, Clock, TrendingUp, UserCheck, Activity, ArrowDownUp } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const formatMoney = (value?: string | number | null) => {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(n);
};

const earningsData = [
  { month: "Jan", earnings: 1200, withdrawals: 900 },
  { month: "Feb", earnings: 1800, withdrawals: 1200 },
  { month: "Mar", earnings: 2400, withdrawals: 1900 },
  { month: "Apr", earnings: 2100, withdrawals: 1700 },
  { month: "May", earnings: 3200, withdrawals: 2600 },
  { month: "Jun", earnings: 2900, withdrawals: 2300 },
  { month: "Jul", earnings: 4100, withdrawals: 3400 },
];

const userGrowthData = [
  { month: "Jan", users: 3200 },
  { month: "Feb", users: 4800 },
  { month: "Mar", users: 7200 },
  { month: "Apr", users: 9100 },
  { month: "May", users: 12400 },
  { month: "Jun", users: 18700 },
  { month: "Jul", users: 24300 },
];

const platformData = [
  { name: "OfferToro", value: 35, color: "#3b82f6" },
  { name: "CPX Research", value: 25, color: "#22d3ee" },
  { name: "Lootably", value: 20, color: "#14b8a6" },
  { name: "Adgate", value: 12, color: "#0ea5e9" },
  { name: "BitLabs", value: 8, color: "#0284c7" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="modern-card rounded-xl p-3 shadow-lg text-xs border border-blue-500/20">
        <p className="font-semibold text-white mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: ${p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers, sub: `${stats?.activeUsers ?? 0} active`, icon: Users, color: "blue", bgIcon: "bg-gradient-to-br from-blue-500/20 to-cyan-500/10", border: "border-blue-500/15" },
    { label: "System Balance", value: `${formatMoney(stats?.totalBalanceInSystem)} USDT`, sub: "across all wallets", icon: Coins, color: "cyan", bgIcon: "bg-gradient-to-br from-cyan-500/20 to-teal-500/10", border: "border-cyan-500/15" },
    { label: "Total Withdrawn", value: `${formatMoney(stats?.totalWithdrawnAllTime)} USDT`, sub: "all time", icon: TrendingUp, color: "emerald", bgIcon: "bg-gradient-to-br from-emerald-500/20 to-green-500/10", border: "border-emerald-500/15" },
    { label: "Pending", value: formatMoney(stats?.pendingWithdrawals), sub: "awaiting review", icon: Clock, color: "red", bgIcon: "bg-gradient-to-br from-red-500/20 to-orange-500/10", border: "border-red-500/15" },
    { label: "Platforms", value: stats?.totalPlatforms, sub: "offerwalls", icon: Gamepad2, color: "purple", bgIcon: "bg-gradient-to-br from-purple-500/20 to-indigo-500/10", border: "border-purple-500/15" },
    { label: "Admins", value: "—", sub: "manage access", icon: UserCheck, color: "teal", bgIcon: "bg-gradient-to-br from-teal-500/20 to-cyan-500/10", border: "border-teal-500/15" },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 flex items-center justify-center border border-cyan-500/15">
              <Activity className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Admin Overview</h1>
              <p className="text-slate-500 text-sm">System-wide metrics and analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/15 rounded-full px-4 py-2 font-semibold">
            <div className="relative">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
              <div className="absolute inset-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-50" />
            </div>
            Live Data
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="stat-card rounded-xl p-5 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bgIcon} flex items-center justify-center border ${stat.border}`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'cyan' ? 'text-cyan-400' :
                    stat.color === 'emerald' ? 'text-emerald-400' :
                    stat.color === 'red' ? 'text-red-400' :
                    stat.color === 'purple' ? 'text-purple-400' :
                    'text-teal-400'
                  }`} />
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24 mt-1 bg-slate-800 rounded" />
              ) : (
                <div className="text-2xl font-extrabold text-white">{stat.value ?? "—"}</div>
              )}
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">{stat.sub}</p>
              <p className="text-xs text-slate-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Earnings vs Withdrawals */}
          <div className="modern-card rounded-2xl lg:col-span-2 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-900/10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15">
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm">Earnings vs Withdrawals</h2>
                <p className="text-xs text-slate-500">Monthly platform performance (USD)</p>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={earningsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="withdrawalsGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="earnings" name="Earnings" stroke="#3b82f6" strokeWidth={2} fill="url(#earningsGrad)" />
                  <Area type="monotone" dataKey="withdrawals" name="Withdrawals" stroke="#22d3ee" strokeWidth={2} fill="url(#withdrawalsGrad2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Distribution */}
          <div className="modern-card rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-900/10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/10 flex items-center justify-center border border-purple-500/15">
                <Gamepad2 className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm">Platform Share</h2>
                <p className="text-xs text-slate-500">Traffic distribution</p>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={platformData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val}%`, 'Share']} contentStyle={{ background: 'rgb(30 41 59)', border: '1px solid rgb(51 65 85)', borderRadius: '8px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {platformData.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-slate-400">{p.name}</span>
                    </div>
                    <span className="font-semibold text-white">{p.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* User Growth */}
          <div className="modern-card rounded-2xl lg:col-span-2 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-900/10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm">User Growth</h2>
                <p className="text-xs text-slate-500">Cumulative registered users</p>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={userGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgb(30 41 59)', border: '1px solid rgb(51 65 85)', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="users" name="Users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="modern-card rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-900/10">
              <h2 className="font-semibold text-white text-sm">Quick Actions</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <Link href="/admin/withdrawals">
                <Button variant="outline" className="w-full h-auto py-3.5 flex flex-col gap-1 border-slate-700 hover:border-cyan-500/40 hover:text-cyan-400 text-xs">
                  <ArrowDownUp className="h-5 w-5" />
                  <span>Withdrawals</span>
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-auto py-3.5 flex flex-col gap-1 border-slate-700 hover:border-cyan-500/40 hover:text-cyan-400 text-xs">
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </Button>
              </Link>
              <Link href="/admin/platforms">
                <Button variant="outline" className="w-full h-auto py-3.5 flex flex-col gap-1 border-slate-700 hover:border-cyan-500/40 hover:text-cyan-400 text-xs">
                  <Gamepad2 className="h-5 w-5" />
                  <span>Offerwalls</span>
                </Button>
              </Link>
              <Link href="/admin/verifications">
                <Button variant="outline" className="w-full h-auto py-3.5 flex flex-col gap-1 border-slate-700 hover:border-cyan-500/40 hover:text-cyan-400 text-xs">
                  <Clock className="h-5 w-5" />
                  <span>Verif. Codes</span>
                </Button>
              </Link>
            </div>

            {stats?.pendingWithdrawals && Number(stats.pendingWithdrawals) > 0 ? (
              <div className="p-4 border-t border-blue-900/10">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Action Required</p>
                  <p className="text-white font-bold text-lg">{stats.pendingWithdrawals} pending</p>
                  <Link href="/admin/withdrawals">
                    <Button className="bg-red-500 text-white hover:bg-red-600 font-semibold w-full text-xs h-8">
                      Review Now
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-blue-900/10">
                <div className="bg-cyan-500/5 border border-cyan-500/15 rounded-xl p-4">
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">System Status</p>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
                      <div className="absolute inset-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-50" />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">All systems operational</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
