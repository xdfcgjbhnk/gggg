import { Layout } from "@/components/layout";
import { useGetMe, useUpdateProfile, useChangePassword, getGetMeQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, User, Lock, Sparkles, Settings as SettingsIcon, Shield, Mail } from "lucide-react";
import { useEffect } from "react";

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function Settings() {
  const { data: user } = useGetMe();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (user?.username) {
      profileForm.reset({ username: user.username });
    }
  }, [user, profileForm]);

  const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    updateProfileMutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Profile updated successfully" });
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Update failed", description: err.data?.error || err.message });
      }
    });
  };

  const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    changePasswordMutation.mutate({ data: { currentPassword: data.currentPassword, newPassword: data.newPassword } }, {
      onSuccess: () => {
        toast({ title: "Password changed successfully" });
        passwordForm.reset();
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Change failed", description: err.data?.error || err.message });
      }
    });
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15">
            <SettingsIcon className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Settings</h1>
            <p className="text-slate-500">Manage your account preferences</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="modern-card rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-900/10">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15">
                <User className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="font-semibold text-white">Profile Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <FormLabel className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  Email (Read Only)
                </FormLabel>
                <Input value={user?.email || ""} disabled className="mt-2 h-12 input-modern rounded-xl opacity-60" />
              </div>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Username</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12 input-modern rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={updateProfileMutation.isPending} className="h-12 btn-primary rounded-xl font-semibold">
                    {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Profile
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Password Card */}
          <div className="modern-card rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-900/10">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/10 flex items-center justify-center border border-red-500/15">
                <Lock className="h-4 w-4 text-red-400" />
              </div>
              <h2 className="font-semibold text-white">Change Password</h2>
            </div>
            <div className="p-6">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="h-12 input-modern rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-slate-500 uppercase tracking-wider font-semibold">New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="h-12 input-modern rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="h-12 input-modern rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={changePasswordMutation.isPending} variant="outline" className="h-12 w-full rounded-xl font-semibold border-slate-700 hover:border-cyan-500/40 hover:text-cyan-400">
                    {changePasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
