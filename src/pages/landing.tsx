import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Zap,
  Coins,
  Shield,
  Clock,
  TrendingUp,
  Star,
  Gamepad2,
  CheckCircle2,
  Globe,
  Award,
  Sparkles,
  ArrowRight,
  Wallet,
  Users,
  Play,
  BarChart3,
  Gift
} from "lucide-react";

const stats = [
  { value: "$2.4M+", label: "Paid Out", icon: Coins },
  { value: "85K+", label: "Active Users", icon: Users },
  { value: "5+", label: "Offerwalls", icon: Gamepad2 },
  { value: "<24h", label: "Withdrawals", icon: Clock },
];

const features = [
  { icon: Gamepad2, title: "Premium Offerwalls", desc: "Access top-tier platforms including OfferToro, CPX Research, Lootably, Adgate Media, and BitLabs." },
  { icon: Coins, title: "Instant USDT Payouts", desc: "Withdraw directly to your BEP20 or TRC20 wallet with zero hidden fees or delays." },
  { icon: Zap, title: "Real-Time Updates", desc: "Watch your earnings appear instantly as offers are credited to your account." },
  { icon: Shield, title: "Verified & Secure", desc: "Every transaction is reviewed and verified to ensure maximum security." },
  { icon: Clock, title: "24h Processing", desc: "Most withdrawals are completed within 24 hours of approval." },
  { icon: TrendingUp, title: "Unlimited Earnings", desc: "No caps on how much you can earn. Complete as many offers as you want." },
];

const testimonials = [
  { name: "ProGamer_99", amount: "$320", text: "Cashed out multiple times. Fast, reliable, and the best GPT platform I've used.", avatar: "P" },
  { name: "CryptoKing88", amount: "$150", text: "Clean interface and real USDT payouts. Exactly what I was looking for.", avatar: "C" },
  { name: "OfferHunter", amount: "$500+", text: "Been here since day one. Offerwalls pay well and support is excellent.", avatar: "O" },
];

const steps = [
  { num: "01", icon: Gamepad2, title: "Choose Your Offers", desc: "Browse through our collection of premium offerwalls and select high-paying games and tasks." },
  { num: "02", icon: Zap, title: "Complete & Earn", desc: "Finish tasks, reach game levels, or complete surveys. Your balance updates instantly." },
  { num: "03", icon: Wallet, title: "Withdraw Crypto", desc: "Request USDT via BEP20 or TRC20. Get paid within 24 hours to your wallet." },
];

const partners = ["OfferToro", "CPX Research", "Lootably", "Adgate Media", "BitLabs"];

function GamerewardsLogo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
  const textSizes = { sm: "text-lg", md: "text-xl", lg: "text-2xl" };
  const iconSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30`}>
        <Coins className={`${iconSizes[size]} text-white`} />
      </div>
      <span className={`${textSizes[size]} font-extrabold tracking-tight`}>
        <span className="text-white">GAME</span><span className="text-blue-400">REWARDS</span>
      </span>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <GamerewardsLogo />
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-slate-400 hover:text-blue-400 transition-colors font-medium">How It Works</a>
              <a href="#features" className="text-sm text-slate-400 hover:text-blue-400 transition-colors font-medium">Features</a>
              <a href="#testimonials" className="text-sm text-slate-400 hover:text-blue-400 transition-colors font-medium">Reviews</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-blue-400 hover:bg-blue-500/10 font-semibold">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="btn-primary px-6 py-2.5 rounded-xl font-bold">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-bg relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] float-animation" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-[100px] float-animation" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[150px]" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 glass-accent rounded-full">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-300">$2.4M+ Paid Out to Real Users</span>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-none mb-8">
            <span className="text-white">Earn Real</span>
            <br />
            <span className="text-gradient-primary">USDT Rewards</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Complete premium gaming offers, play your favorite games, and withdraw crypto directly to your wallet. No investment required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/register">
              <Button size="lg" className="btn-primary text-lg px-10 py-6 rounded-2xl font-bold group">
                Start Earning Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="glass text-white text-lg px-10 py-6 rounded-2xl font-bold hover:bg-blue-500/10 hover:border-blue-500/30 transition-all">
                I Have an Account
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Free to join</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> No credit card</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Instant payouts</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> 24/7 support</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-blue-500/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-blue-500 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Partners Marquee */}
      <section className="py-6 bg-slate-950/50 border-y border-blue-900/20">
        <div className="flex items-center gap-16 whitespace-nowrap px-6" style={{animation: 'marquee 25s linear infinite'}}>
          {[...partners, ...partners].map((p, i) => (
            <span key={i} className="text-sm font-bold text-blue-500/40 uppercase tracking-[0.2em] flex-shrink-0">{p}</span>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-slate-950/50 to-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="stat-card p-6 text-center group hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-4xl md:text-5xl font-extrabold text-gradient-primary mb-2">{stat.value}</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">
              <Play className="w-4 h-4" />
              Simple 3-Step Process
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">How It Works</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Start earning crypto in minutes with our simple process</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={step.num} className="modern-card-accent rounded-2xl p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 text-[150px] font-extrabold text-blue-500/5 select-none leading-none">{step.num}</div>

                {/* Icon */}
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center mb-6 border border-blue-500/15 group-hover:border-cyan-500/30 group-hover:scale-105 transition-all">
                  <step.icon className="w-8 h-8 text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">
              <BarChart3 className="w-4 h-4" />
              Premium Features
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Why Choose GAMEREWARDS?</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Built to maximize your earnings with industry-leading features</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div key={feature.title} className="modern-card rounded-xl p-6 group hover:border-blue-500/25 transition-all hover:translate-y-[-2px]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15 shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 bg-gradient-to-b from-background to-slate-950/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="modern-card-accent rounded-3xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15">
                  <Globe className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Available Worldwide</h3>
                  <p className="text-slate-400">Withdraw to any BEP20 or TRC20 wallet globally</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 flex items-center justify-center border border-cyan-500/15">
                  <Award className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Trusted Platform</h3>
                  <p className="text-slate-400">$2.4M+ paid out with verified transactions</p>
                </div>
              </div>
              <Link href="/register">
                <Button className="btn-primary px-8 py-3 rounded-xl font-bold">
                  Join Now <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">
              <Star className="w-4 h-4" />
              User Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">What Our Users Say</h2>
            <p className="text-lg text-slate-400">Real experiences from real earners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="modern-card rounded-2xl p-6 group hover:border-blue-500/25 transition-all">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-blue-400 text-blue-400" />)}
                </div>

                {/* Quote */}
                <p className="text-slate-300 leading-relaxed mb-6">"{t.text}"</p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center text-sm font-bold text-blue-400 border border-blue-500/20">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-cyan-400 font-semibold">{t.amount} withdrawn</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-b from-slate-950/30 via-background to-slate-950/50 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Gift Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20 mb-8">
            <Gift className="w-10 h-10 text-blue-400" />
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Start Earning Today
            <span className="text-gradient-primary"> — It's Free</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join 85,000+ users already earning USDT rewards. No investment, no hidden fees.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="btn-primary text-lg px-12 py-6 rounded-2xl font-bold group">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="glass text-white text-lg px-12 py-6 rounded-2xl font-bold hover:bg-blue-500/10">
                Sign In
              </Button>
            </Link>
          </div>

          <p className="text-sm text-slate-500 mt-8">
            Min. withdrawal: $1 USDT · BEP20, TRC20, Sham Cash, Syriatel Cash & Coenex
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950/50 border-t border-blue-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <GamerewardsLogo />
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} GAMEREWARDS. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <Link href="/register"><span className="text-sm text-slate-500 hover:text-blue-400 cursor-pointer transition-colors">Sign Up</span></Link>
              <Link href="/login"><span className="text-sm text-slate-500 hover:text-blue-400 cursor-pointer transition-colors">Login</span></Link>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
