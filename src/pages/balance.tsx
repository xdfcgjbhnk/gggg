import { Layout } from "@/components/layout";
import { useGetBalance, useGetDashboardStats } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Coins, Send, Clock, Wallet, TrendingUp, Sparkles, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formatMoney = (value?: string | number | null) => {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
};

export default function Balance() {
  const { data: balanceData, isLoading } = useGetBalance();

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-1">Wallet</h1>
              <p className="text-slate-500">Manage your earnings</p>
            </div>
          </div>
          <Link href="/withdraw">
            <Button className="btn-primary rounded-xl">
              <Send className="h-4 w-4 mr-2" /> Withdraw
            </Button>
          </Link>
        </div>

        {/* Main Balance Card */}
        <div className="modern-card-accent rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

          <div className="relative p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Available Balance</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/25 to-teal-500/15 flex items-center justify-center border border-cyan-500/20">
                    <Wallet className="h-6 w-6 text-cyan-400" />
                  </div>
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
              </div>
            </div>

            {isLoading ? (
              <Skeleton className="h-16 w-48 bg-slate-800 rounded-xl" />
            ) : (
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-extrabold text-gradient-accent">${formatMoney(balanceData?.balance)}</span>
                <span className="text-2xl font-bold text-cyan-400">USDT</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="stat-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center border border-emerald-500/15">
                <Coins className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Total Earned</p>
            {isLoading ? (
              <Skeleton className="h-8 w-28 bg-slate-800 rounded" />
            ) : (
              <span className="text-2xl font-extrabold text-white">{formatMoney(balanceData?.totalEarned)} USDT</span>
            )}
          </div>

          <div className="stat-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/10 flex items-center justify-center border border-orange-500/15">
                <Clock className="h-5 w-5 text-orange-400" />
              </div>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Pending Withdrawals</p>
            {isLoading ? (
              <Skeleton className="h-8 w-28 bg-slate-800 rounded" />
            ) : (
              <span className="text-2xl font-extrabold text-white">{formatMoney(balanceData?.pendingWithdrawals)} USDT</span>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
