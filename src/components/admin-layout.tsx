import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, ArrowDownUp, Gamepad2, ShieldCheck, KeyRound, Menu, ChevronLeft, Coins, Sparkles } from "lucide-react";
import { removeToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect } from "react";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowDownUp },
  { href: "/admin/platforms", label: "Offerwalls", icon: Gamepad2 },
  { href: "/admin/admins", label: "Admins", icon: ShieldCheck },
  { href: "/admin/verifications", label: "Verif. Codes", icon: KeyRound },
];

function GamerewardsLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <Coins className="w-5 h-5 text-white" />
      </div>
      <span className="text-lg font-extrabold tracking-tight">
        <span className="text-white">GAME</span><span className="text-blue-400">REWARDS</span>
      </span>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetMe();

  useEffect(() => {
    if (!isLoading && !user) setLocation("/login");
    else if (!isLoading && user && !user.isAdmin && !user.isSuperAdmin) setLocation("/dashboard");
  }, [isLoading, user, setLocation]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user.isAdmin && !user.isSuperAdmin) return null;

  const handleLogout = () => { removeToken(); queryClient.clear(); setLocation("/login"); };

  const NavLinks = ({ closeSheet }: { closeSheet?: () => void }) => (
    <>
      {adminNavItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href} onClick={closeSheet}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-medium group ${
              isActive
                ? "nav-active text-blue-400"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent"
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                isActive
                  ? "bg-gradient-to-br from-blue-500/25 to-cyan-500/15 border border-blue-500/20"
                  : "bg-slate-800/50 border border-slate-700/50 group-hover:bg-slate-700/50"
              }`}>
                <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white"}`} />
              </div>
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-background text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-900/95 to-slate-950/90 border-r border-blue-900/10 shrink-0">
        {/* Logo Area */}
        <div className="p-5 border-b border-blue-900/10">
          <Link href="/"><GamerewardsLogo /></Link>
          <div className="mt-3 flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-50" />
            </div>
            <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          <NavLinks />
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-blue-900/10 space-y-3">
          {/* User Card */}
          <div className="modern-card-accent rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 flex items-center justify-center border border-cyan-500/15">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{user.isSuperAdmin ? "Super Admin" : "Admin"}</p>
              </div>
            </div>
          </div>

          {/* Back to App */}
          <Link href="/dashboard">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-blue-500/15">
              <ChevronLeft className="h-4 w-4" />Back to App
            </div>
          </Link>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-400 border border-red-500/10 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-background via-slate-950/50 to-background">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 glass sticky top-0 z-50 border-b border-blue-900/10">
          <div className="flex items-center gap-2">
            <Link href="/"><GamerewardsLogo /></Link>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Admin</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-slate-900 to-slate-950 border-blue-900/10">
              <div className="p-5 border-b border-blue-900/10">
                <GamerewardsLogo />
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-widest">Admin Panel</span>
                </div>
              </div>
              <nav className="p-4 flex flex-col gap-1.5">
                <NavLinks />
              </nav>
              <div className="p-4 border-t border-blue-900/10">
                <div className="modern-card-accent rounded-xl p-4 mb-3">
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{user.isSuperAdmin ? "Super Admin" : "Admin"}</p>
                </div>
                <Link href="/dashboard">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-800/50 cursor-pointer mb-2">
                    <ChevronLeft className="h-4 w-4" />Back to App
                  </div>
                </Link>
                <Button variant="ghost" size="sm" className="w-full justify-start text-red-400 hover:bg-red-500/10" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
