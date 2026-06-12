import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useResetPassword } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, Lock, Sparkles, AlertCircle } from "lucide-react";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

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

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const resetPasswordMutation = useResetPassword();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) {
      toast({ variant: "destructive", title: "Error", description: "Missing reset token" });
      return;
    }

    resetPasswordMutation.mutate({ data: { token, password: data.password } }, {
      onSuccess: () => {
        toast({
          title: "Password Reset",
          description: "Your password has been successfully reset.",
        });
        setLocation("/login");
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: error.data?.error || error.message || "An error occurred",
        });
      },
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-3">Invalid Link</h1>
          <p className="text-slate-500 mb-8">The password reset link is missing or invalid.</p>
          <Link href="/forgot-password">
            <Button className="h-12 btn-primary rounded-xl font-semibold">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="mb-12">
            <GamerewardsLogo />
          </div>

          <h2 className="text-4xl font-extrabold text-white mb-4">Create New Password</h2>
          <p className="text-lg text-slate-400 mb-12">Choose a strong password to secure your account.</p>

          {/* Feature */}
          <div className="flex items-center gap-4 modern-card rounded-xl p-4 text-left">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15 shrink-0">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-slate-300 font-medium">Minimum 8 characters required</span>
          </div>

          {/* Badge */}
          <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 glass-accent rounded-full">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-300">Secure Your Account</span>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 lg:max-w-xl flex flex-col items-center justify-center px-8 py-12 bg-slate-950/30 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />

        {/* Mobile Logo */}
        <div className="lg:hidden mb-10 relative z-10">
          <GamerewardsLogo />
        </div>

        <div className="w-full max-w-sm relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">New Password</h1>
            <p className="text-slate-500">Enter your new password below</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-500 uppercase tracking-wider font-semibold">New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-12 input-modern rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-12 input-modern rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 btn-primary rounded-xl font-semibold"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Reset Password"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
