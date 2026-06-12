import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, Sparkles, Zap, Shield, Wallet, Mail, Lock, ArrowRight } from "lucide-react";

const loginSchema = z.object({ email: z.string().email("Invalid email"), password: z.string().min(1, "Required") });
type LoginFormValues = z.infer<typeof loginSchema>;

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

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useLogin();
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({ data }, {
      onSuccess: (res) => { setToken(res.token); toast({ title: "Welcome back!" }); setLocation("/dashboard"); },
      onError: (error: any) => { toast({ variant: "destructive", title: "Login failed", description: error.data?.error || error.message }); },
    });
  };

  const features = [
    { icon: Wallet, text: "Access your wallet instantly", color: "blue" },
    { icon: Zap, text: "Real-time balance updates", color: "cyan" },
    { icon: Shield, text: "Secure encrypted transactions", color: "teal" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Decorative Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-background items-center justify-center p-16">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[150px]" />
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
          <h2 className="text-4xl font-extrabold text-white mb-4">Welcome Back</h2>
          <p className="text-lg text-slate-400 mb-12">Sign in to access your earnings and continue your journey.</p>

          {/* Features */}
          <div className="space-y-4 text-left">
            {features.map((feature, i) => (
              <div key={i} className="modern-card rounded-xl p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${
                  feature.color === 'blue' ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/20' :
                  feature.color === 'cyan' ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500/20' :
                  'bg-gradient-to-br from-teal-500/20 to-teal-600/10 border-teal-500/20'
                }`}>
                  <feature.icon className={`w-5 h-5 ${
                    feature.color === 'blue' ? 'text-blue-400' :
                    feature.color === 'cyan' ? 'text-cyan-400' :
                    'text-teal-400'
                  }`} />
                </div>
                <span className="text-slate-300 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Badge */}
          <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 glass-accent rounded-full">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-300">$2.4M+ paid out</span>
          </div>
        </div>
      </div>

      {/* Right - Login Form */}
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
            <h1 className="text-3xl font-extrabold text-white mb-2">Sign In</h1>
            <p className="text-slate-500">Enter your credentials to continue</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-1.5">
                    <FormLabel className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5" />
                      Password
                    </FormLabel>
                    <Link href="/forgot-password">
                      <span className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer font-semibold">Forgot password?</span>
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••"
                      {...field}
                      className="h-12 input-modern rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button
                type="submit"
                className="w-full h-12 btn-primary rounded-xl font-semibold group"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    Sign In to Your Account
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

          {/* Register Link */}
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-4">Don't have an account yet?</p>
            <Link href="/register">
              <Button variant="outline" className="w-full h-12 rounded-xl border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 font-semibold">
                Create Free Account
              </Button>
            </Link>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-slate-600 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
