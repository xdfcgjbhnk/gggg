import { Layout } from "@/components/layout";
import { useGetDashboardStats, useGetBalance, useListPlatforms, useGetMe } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Coins, Download, CheckCircle2, History, ArrowUpRight, Gamepad2, Zap, ExternalLink, TrendingUp, Sparkles, Wallet, Activity } from "lucide-react";
import { useEffect, useState } from "react";

const formatMoney = (value?: string | number | null) => {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(n);
};

function buildOfferUrl(template: string, userId: number): string {
  return template
    .replace(/\{USER_ID\}/g, String(userId))
    .replace(/\[USER_ID\]/g, String(userId))
    .replace(/%7BUSER_ID%7D/g, String(userId));
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: balanceData } = useGetBalance();
  const { data: platformsData } = useListPlatforms();
  const { data: user } = useGetMe();
  const [featuredPlatform, setFeaturedPlatform] = useState<any>(null);

  useEffect(() => {
    if (!platformsData?.platforms) return;
    const hp = platformsData.platforms.find((p: any) => p.placement === "homepage" && p.isEnabled && p.apiEndpoint);
    if (hp) {
      setFeaturedPlatform(hp);
    } else {
      const fallback = platformsData.platforms.find((p: any) => p.apiEndpoint && p.isEnabled);
      if (fallback) setFeaturedPlatform(fallback);
    }
  }, [platformsData]);

  const offerUrl = featuredPlatform && user?.id
    ? buildOfferUrl(featuredPlatform.apiEndpoint, user.id)
    : featuredPlatform?.apiEndpoint;

  const statCards = [
    {
      label: "Current Balance",
      value: `$${formatMoney(balanceData?.balance)}`,
      icon: Wallet,
      color: "blue",
      bgIcon: "bg-gradient-to-br from-blue-500/20 to-cyan-500/10",
      border: "border-blue-500/15",
      highlight: true
    },
    {
      label: "Total Earned",
      value: `$${formatMoney(stats?.totalEarned)}`,
      icon: TrendingUp,
      color: "emerald",
      bgIcon: "bg-gradient-to-br from-emerald-500/20 to-green-500/10",
      border: "border-emerald-500/15",
      highlight: false
    },
    {
      label: "Total Withdrawn",
      value: `$${formatMoney(stats?.totalWithdrawn)}`,
      icon: Download,
      color: "cyan",
      bgIcon: "bg-gradient-to-br from-cyan-500/20 to-teal-500/10",
      border: "border-cyan-500/15",
      highlight: false
    },
    {
      label: "Pending",
      value: `$${formatMoney(stats?.pendingWithdrawals)}`,
      icon: History,
      color: "orange",
      bgIcon: "bg-gradient-to-br from-orange-500/20 to-yellow-500/10",
      border: "border-orange-500/15",
      highlight: false
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-0.5 sm:mb-1">Dashboard</h1>
              <p className="text-slate-500 text-sm sm:text-base">Your earnings overview at a glance</p>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link href="/platforms">
              <Button variant="outline" size="sm" className="h-9 sm:h-10 border-blue-500/15 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 rounded-lg sm:rounded-xl text-sm">
                <Gamepad2 className="h-4 w-4 mr-1 sm:mr-2" />Browse Offers
              </Button>
            </Link>
            <Link href="/withdraw">
              <Button size="sm" className="h-9 sm:h-10 btn-primary rounded-lg sm:rounded-xl text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1 sm:mr-2" />Withdraw
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`stat-card rounded-xl p-3 sm:p-4 md:p-5 ${stat.highlight ? "glow-primary" : ""}`}
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl ${stat.bgIcon} flex items-center justify-center border ${stat.border}`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'emerald' ? 'text-emerald-400' :
                    stat.color === 'cyan' ? 'text-cyan-400' :
                    'text-orange-400'
                  }`} />
                </div>
                {stat.highlight && (
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 animate-pulse" />
                )}
              </div>
              <div className="mb-0.5 sm:mb-1">
                {statsLoading ? (
                  <Skeleton className="h-6 sm:h-8 md:h-9 w-20 sm:w-24 md:w-28 bg-slate-800 rounded" />
                ) : (
                  <span className={`text-lg sm:text-2xl md:text-3xl font-extrabold ${stat.highlight ? "text-gradient-primary" : "text-white"}`}>
                    {stat.value}
                  </span>
                )}
              </div>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Featured Platform Card */}
        <div className="modern-card-accent rounded-xl sm:rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b border-blue-900/10 bg-slate-950/50">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" />
                <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 animate-ping opacity-50" />
              </div>
              {featuredPlatform?.logoUrl ? (
                <img src={featuredPlatform.logoUrl} alt={featuredPlatform.name} className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover border border-slate-700" />
              ) : (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                </div>
              )}
              <span className="font-semibold text-white text-sm sm:text-base">
                {featuredPlatform ? featuredPlatform.name : "No Featured Platform"}
              </span>
              {featuredPlatform && (
                <span className="text-[9px] sm:text-[10px] bg-cyan-500 text-white px-1.5 sm:px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider">Live</span>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {offerUrl && (
                <a
                  href={offerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in new tab
                </a>
              )}
              <Link href="/platforms">
                <Button variant="outline" size="sm" className="h-7 sm:h-8 text-[10px] sm:text-xs border-blue-500/15 text-blue-400 hover:bg-blue-500/10 rounded-lg">
                  <Gamepad2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                  Switch
                </Button>
              </Link>
            </div>
          </div>

          {/* Iframe Area */}
          {featuredPlatform && offerUrl ? (
            <iframe
              key={featuredPlatform.id}
              src={offerUrl}
              className="w-full border-0"
              style={{ height: "450px" }}
              allow="fullscreen"
              title={featuredPlatform.name}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16 md:py-24 px-4 sm:px-8" style={{ minHeight: "450px" }}>
              <div className="w-14 h-14 sm:w-16 md:w-20 sm:h-16 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/15 flex items-center justify-center mb-4 sm:mb-6">
                <Gamepad2 className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">No Platform Featured</h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-xs sm:max-w-sm mb-4 sm:mb-6 px-4">
                The admin hasn't configured a featured platform yet. Browse available offerwalls to start earning.
              </p>
              <Link href="/platforms">
                <Button className="btn-primary rounded-xl text-sm">
                  <Gamepad2 className="h-4 w-4 mr-2" /> Browse Offerwalls
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
