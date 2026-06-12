import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, Sparkles, Zap, Shield, Gift, Mail, Lock, User, ArrowRight } from "lucide-react";
import { customFetch } from "@/lib/api-client/custom-fetch";
import type { AuthResponse } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z.string().min(3, "Min 3 characters").max(30),
  password: z.string().min(8, "Min 8 characters"),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

function GamerewardsLogo() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <Coins className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-extrabold tracking-tight">
        <span className="text-white">GAME</span><span className="text-blue-400">REWARDS</span>
      </div>
    </div>
  );
}

const perks = [
  { icon: Gift, text: "Free to join — No credit card required", color: "blue" },
  { icon: Zap, text: "Instant USDT withdrawals to any wallet", color: "cyan" },
  { icon: Shield, text: "Access 5+ premium offerwalls", color: "teal" },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const form = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema), defaultValues: { email: "", username: "", password: "" } });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormValues) => customFetch<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (res) => { setToken(res.token); toast({ title: "Welcome to GAMEREWARDS!" }); setLocation("/dashboard"); },
    onError: (error: any) => { toast({ variant: "destructive", title: "Registration failed", description: error.data?.error || error.message }); },
  });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Decorative Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-background items-center justify-center p-16">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[150px]" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="mb-12">
            <GamerewardsLogo />
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-extrabold text-white mb-4">Start Earning Today</h2>
          <p className="text-lg text-slate-400 mb-12">Create your free account and start withdrawing USDT in minutes.</p>

          {/* Perks */}
          <div className="space-y-4 text-left">
            {perks.map((perk, i) => (
              <div key={i} className="modern-card-accent rounded-xl p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${
                  perk.color === 'blue' ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/20' :
                  perk.color === 'cyan' ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500/20' :
                  'bg-gradient-to-br from-teal-500/20 to-teal-600/10 border-teal-500/20'
                }`}>
                  <perk.icon className={`w-5 h-5 ${
                    perk.color === 'blue' ? 'text-blue-400' :
                    perk.color === 'cyan' ? 'text-cyan-400' :
                    'text-teal-400'
                  }`} />
                </div>
                <span className="text-slate-300 font-medium">{perk.text}</span>
              </div>
            ))}
          </div>

          {/* Badge */}
          <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 glass-accent rounded-full">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-300">Join 85,000+ users</span>
          </div>
        </div>
      </div>

      {/* Right - Register Form */}
      <div className="flex-1 lg:max-w-xl flex flex-col items-center justify-center px-8 py-12 bg-slate-950/30 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />

        {/* Mobile Logo */}
        <div className="lg:hidden mb-10 relative z-10">
          <GamerewardsLogo />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">Create Account</h1>
            <p className="text-slate-500">Join thousands of users earning USDT daily</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(registerMutation.mutate)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      className="h-12 input-modern rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="YourUsername"
                      {...field}
                      className="h-12 input-modern rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Min. 8 characters"
                      {...field}
                      className="h-12 input-modern rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button
                type="submit"
                className="w-full h-12 btn-accent rounded-xl font-semibold mt-2 group"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-4">Already have an account?</p>
            <Link href="/login">
              <Button variant="outline" className="w-full h-12 rounded-xl border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 font-semibold">
                Sign In Instead
              </Button>
            </Link>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-slate-600 mt-8">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
