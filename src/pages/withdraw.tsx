import { useState } from "react";
import { Layout } from "@/components/layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateWithdrawal, useListWithdrawals, useGetBalance, getGetBalanceQueryKey, getListWithdrawalsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Wallet, History, Sparkles, ArrowUpCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const formatMoney = (value?: string | number | null) => {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
};

const networkOptions = [
  { value: "BEP20",         label: "BNB Smart Chain (BEP20)",  addressLabel: "Wallet Address",             addressPlaceholder: "0x..." },
  { value: "TRC20",         label: "Tron (TRC20)",             addressLabel: "Wallet Address",             addressPlaceholder: "T..."  },
  { value: "SHAM_CASH",     label: "(Sham Cash)",      addressLabel: "Phone Number",               addressPlaceholder: "09xxxxxxxx" },
  { value: "SYRIATEL_CASH", label: "(Syriatel Cash)", addressLabel: "Phone Number",           addressPlaceholder: "09xxxxxxxx" },
  { value: "COENEX_EMAIL",  label: "Coenex (Email)",           addressLabel: "Email Address",              addressPlaceholder: "you@example.com" },
];

const withdrawSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  network: z.enum(["BEP20", "TRC20", "SHAM_CASH", "SYRIATEL_CASH", "COENEX_EMAIL"]),
  walletAddress: z.string().min(3, "Required"),
});

type WithdrawForm = z.infer<typeof withdrawSchema>;

export default function Withdraw() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: balanceData } = useGetBalance();
  const { data: historyData, isLoading: historyLoading } = useListWithdrawals({ page: 1, limit: 10 });
  const withdrawMutation = useCreateWithdrawal();

  const form = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: "",
      network: "BEP20",
      walletAddress: "",
    },
  });

  const selectedNetwork = form.watch("network");
  const networkMeta = networkOptions.find(n => n.value === selectedNetwork) ?? networkOptions[0];

  const onSubmit = (data: WithdrawForm) => {
    withdrawMutation.mutate({ data: { ...data, network: data.network as any } }, {
      onSuccess: () => {
        toast({ title: "Withdrawal Requested", description: "Your request is being processed." });
        form.reset();
        queryClient.invalidateQueries({ queryKey: getGetBalanceQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListWithdrawalsQueryKey({ page: 1, limit: 10 }) });
      },
      onError: (error: any) => {
        toast({ variant: "destructive", title: "Withdrawal Failed", description: error.data?.error || "Could not process request" });
      },
    });
  };

  const networkDisplayName = (network: string) =>
    networkOptions.find(n => n.value === network)?.label ?? network;

  return (
    <Layout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 flex items-center justify-center border border-cyan-500/15">
            <ArrowUpCircle className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Withdraw Funds</h1>
            <p className="text-slate-500">Transfer your balance to your preferred payment method</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Withdrawal Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="modern-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15">
                  <Send className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Request Withdrawal</h2>
                  <p className="text-xs text-slate-500">Minimum withdrawal: $1</p>
                </div>
              </div>

              <div className="mb-6 p-4 stat-card rounded-xl flex justify-between items-center">
                <span className="text-slate-500 text-xs font-semibold uppercase">Available</span>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="font-extrabold text-gradient-primary">{formatMoney(balanceData?.balance)} USDT</span>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Amount (USDT)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="1.00" {...field} className="h-12 input-modern rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="network"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Payment Method</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("walletAddress", "");
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 input-modern rounded-xl">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-800">
                            {networkOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-slate-800">{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                          {networkMeta.addressLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={networkMeta.addressPlaceholder}
                            {...field}
                            className="h-12 input-modern rounded-xl font-mono text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-12 btn-primary rounded-xl font-semibold mt-2"
                    disabled={withdrawMutation.isPending}
                  >
                    {withdrawMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Withdraw Now"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* History */}
          <div className="lg:col-span-2">
            <div className="modern-card rounded-2xl overflow-hidden h-full flex flex-col">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-900/10">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/10 flex items-center justify-center border border-cyan-500/15">
                  <History className="h-5 w-5 text-cyan-400" />
                </div>
                <h2 className="font-semibold text-white">Withdrawal History</h2>
              </div>
              <div className="flex-1 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-900/50">
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Date</TableHead>
                      <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Amount</TableHead>
                      <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Method</TableHead>
                      <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyLoading ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-12"><Loader2 className="animate-spin h-6 w-6 mx-auto text-blue-400"/></TableCell></TableRow>
                    ) : historyData?.withdrawals?.length ? (
                      historyData.withdrawals.map((w) => (
                        <TableRow key={w.id} className="border-slate-800 hover:bg-slate-800/30">
                          <TableCell className="text-slate-400 whitespace-nowrap text-sm">
                            {new Date(w.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-semibold text-white">{w.amount} USDT</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-semibold text-xs border-slate-700 text-slate-300">
                              {networkDisplayName(w.network)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={w.status === "paid" ? "default" : w.status === "rejected" ? "destructive" : "secondary"}
                              className={`uppercase tracking-wider text-[10px] font-semibold ${
                                w.status === "paid" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                                w.status === "rejected" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                                "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              }`}
                            >
                              {w.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-40 text-center text-slate-500">
                          No withdrawals yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
