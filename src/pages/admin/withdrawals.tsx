import { useState } from "react";
import { AdminLayout as Layout } from "@/components/admin-layout";
import { useListAllWithdrawals, useUpdateWithdrawalStatus, getListAllWithdrawalsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowDownUp, CreditCard, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminWithdrawals() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const limit = 10;
  const { data, isLoading } = useListAllWithdrawals({ page, limit, ...(status !== 'all' && { status: status as any }) });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/10 flex items-center justify-center border border-orange-500/15">
              <RefreshCw className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Withdrawals</h1>
              <p className="text-slate-500 text-sm">Review and process withdrawal requests</p>
            </div>
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px] input-modern rounded-xl h-10">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="modern-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-900/50">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider">User ID</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Amount</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Network / Wallet</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="animate-spin h-6 w-6 mx-auto text-blue-400" /></TableCell></TableRow>
                ) : data?.withdrawals?.map(w => (
                  <TableRow key={w.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <TableCell className="font-mono text-xs text-slate-400">{w.userId}</TableCell>
                    <TableCell className="font-semibold text-white">{w.amount} USDT</TableCell>
                    <TableCell>
                      <div className="text-xs text-slate-500">{w.network}</div>
                      <div className="font-mono text-xs text-slate-400 truncate max-w-[150px]" title={w.walletAddress}>{w.walletAddress}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] font-semibold uppercase tracking-wider ${
                        w.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        w.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        w.status === 'pending' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                      }`}>{w.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <WithdrawalActions withdrawal={w} />
                    </TableCell>
                  </TableRow>
                ))}
                {data?.withdrawals?.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-500">No withdrawals found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {data && data.total > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-900/20">
              <div className="text-sm text-slate-500">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="border-slate-800 text-slate-400 hover:text-white hover:border-blue-500/30 rounded-lg">Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * limit >= data.total} className="border-slate-800 text-slate-400 hover:text-white hover:border-blue-500/30 rounded-lg">Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function WithdrawalActions({ withdrawal }: { withdrawal: any }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateStatus = useUpdateWithdrawalStatus();
  const [status, setStatus] = useState<any>(withdrawal.status);
  const [txHash, setTxHash] = useState(withdrawal.txHash || "");
  const [adminNote, setAdminNote] = useState(withdrawal.adminNote || "");

  const handleUpdate = () => {
    updateStatus.mutate({ withdrawalId: withdrawal.id, data: { status, txHash, adminNote } }, {
      onSuccess: () => {
        toast({ title: "Updated" });
        queryClient.invalidateQueries({ queryKey: getListAllWithdrawalsQueryKey() });
      },
      onError: (err: any) => toast({ variant: "destructive", title: "Error", description: err.data?.error || "Failed" })
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 rounded-lg border-blue-500/15 text-blue-400 hover:bg-blue-500/10">
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="modern-card rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Update Withdrawal #{withdrawal.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-12 input-modern rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Transaction Hash" value={txHash} onChange={e => setTxHash(e.target.value)} className="h-12 input-modern rounded-xl" />
          <Input placeholder="Admin Note" value={adminNote} onChange={e => setAdminNote(e.target.value)} className="h-12 input-modern rounded-xl" />
          <Button onClick={handleUpdate} disabled={updateStatus.isPending} className="w-full h-12 btn-primary rounded-xl font-semibold">
            {updateStatus.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
