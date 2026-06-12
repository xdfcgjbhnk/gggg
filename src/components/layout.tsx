import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Wallet, History, Send, Gamepad2, Settings, ShieldAlert, Menu, Languages, Coins, Sparkles } from "lucide-react";
import { removeToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useMemo, useState } from "react";

const translations = {
  en: { dashboard: "Dashboard", balance: "Balance", transactions: "Transactions", withdraw: "Withdraw", platforms: "Platforms", settings: "Settings", adminPanel: "Admin Panel", logout: "Logout", loading: "Loading..." },
  ar: { dashboard: "لوحة التحكم", balance: "الرصيد", transactions: "العمليات", withdraw: "سحب", platforms: "المنصات", settings: "الإعدادات", adminPanel: "لوحة الأدمن", logout: "تسجيل الخروج", loading: "جاري التحميل..." },
} as const;

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

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetMe();
  const [language, setLanguage] = useState<"en" | "ar">(() => (localStorage.getItem("cv-language") as "en" | "ar") || "en");

  useEffect(() => {
    localStorage.setItem("cv-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    if (!isLoading && !user) setLocation("/login");
  }, [isLoading, user, setLocation]);

  const t = useMemo(() => translations[language], [language]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">{t.loading}</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => { removeToken(); queryClient.clear(); setLocation("/login"); };

  const navItems = [
    { href: "/dashboard", label: t.dashboard, icon: Home },
    { href: "/balance", label: t.balance, icon: Wallet },
    { href: "/transactions", label: t.transactions, icon: History },
    { href: "/withdraw", label: t.withdraw, icon: Send },
    { href: "/platforms", label: t.platforms, icon: Gamepad2 },
    { href: "/settings", label: t.settings, icon: Settings },
    ...(user.isAdmin || user.isSuperAdmin ? [{ href: "/admin/dashboard", label: t.adminPanel, icon: ShieldAlert }] : []),
  ];

  const NavLinks = ({ closeSheet }: { closeSheet?: () => void }) => (
    <>
      {navItems.map((item) => {
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
              {item.href === "/admin/dashboard" && (
                <span className="ml-auto text-[9px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-lg font-semibold uppercase tracking-wider border border-blue-500/15">Admin</span>
              )}
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
        <div className="p-6 border-b border-blue-900/10">
          <div className="flex items-center justify-between">
            <Link href="/"><GamerewardsLogo /></Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="h-8 px-3 text-xs border-blue-500/15 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30"
            >
              <Languages className="h-3.5 w-3.5 mr-1" />
              {language === "en" ? "AR" : "EN"}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          <NavLinks />
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-blue-900/10 space-y-3">
          {/* User Card */}
          <div className="modern-card rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-400 border border-red-500/10 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t.logout}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-background via-slate-950/50 to-background">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 glass sticky top-0 z-50 border-b border-blue-900/10">
          <Link href="/"><GamerewardsLogo /></Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="h-8 px-3 text-xs border-blue-500/15 text-blue-400"
            >
              <Languages className="h-3.5 w-3.5 mr-1" />
              {language === "en" ? "AR" : "EN"}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-slate-900 to-slate-950 border-blue-900/10">
                <div className="p-6 border-b border-blue-900/10">
                  <GamerewardsLogo />
                </div>
                <nav className="p-4 flex flex-col gap-1.5">
                  <NavLinks />
                </nav>
                <div className="p-4 border-t border-blue-900/10">
                  <div className="modern-card rounded-xl p-4 mb-3">
                    <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-red-400 hover:bg-red-500/10" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />{t.logout}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-blue-900/10">
          <div className="flex items-center justify-around py-2 px-2">
            {navItems.slice(0, 5).map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    isActive ? "bg-blue-500/10" : "hover:bg-slate-800/50"
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive
                        ? "bg-gradient-to-br from-blue-500/25 to-cyan-500/15 border border-blue-500/20"
                        : "bg-slate-800/50 border border-slate-700/50"
                    }`}>
                      <item.icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                    </div>
                    <span className={`text-[10px] font-semibold ${isActive ? "text-blue-400" : "text-slate-500"}`}>
                      {item.label.toString().split(' ')[0]}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
