import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForgotPassword } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, Mail, Sparkles, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

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

export default function ForgotPassword() {
  const { toast } = useToast();
  const forgotPasswordMutation = useForgotPassword();
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate({ data }, {
      onSuccess: () => {
        setSuccess(true);
        toast({
          title: "Email sent",
          description: "Check your inbox for reset instructions.",
        });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Failed to send reset email",
          description: error.data?.error || error.message || "An error occurred",
        });
      },
    });
  };

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
          <div className="mb-12">
            <GamerewardsLogo />
          </div>

          <h2 className="text-4xl font-extrabold text-white mb-4">Reset Password</h2>
          <p className="text-lg text-slate-400 mb-12">We'll send you a secure link to reset your password.</p>

          {/* Feature */}
          <div className="flex items-center gap-4 modern-card rounded-xl p-4 text-left">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/10 flex items-center justify-center border border-cyan-500/15 shrink-0">
              <Mail className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-slate-300 font-medium">Check your email for the reset link</span>
          </div>

          {/* Badge */}
          <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 glass-accent rounded-full">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-300">Secure & Encrypted</span>
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
            <h1 className="text-3xl font-extrabold text-white mb-2">Forgot Password?</h1>
            <p className="text-slate-500">Enter your email to receive a reset link</p>
          </div>

          {success ? (
            <div className="space-y-6">
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <p className="text-cyan-400 font-medium">We've sent a password reset link to your email.</p>
              </div>
              <Link href="/login">
                <Button className="w-full h-12 btn-primary rounded-xl font-semibold">
                  <ArrowLeft className="h-4 w-4 mr-2" />Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} className="h-12 input-modern rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 btn-primary rounded-xl font-semibold"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-4">Remembered your password?</p>
            <Link href="/login">
              <Button variant="outline" className="w-full h-12 rounded-xl border-blue-500/15 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 font-semibold">
                Sign In Instead
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
