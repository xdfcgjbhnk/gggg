import { useState } from "react";
import { AdminLayout as Layout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, CheckCircle2, RefreshCw, KeyRound, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface PendingVerification {
  id: number;
  email: string;
  username: string;
  code: string;
  expiresAt: string;
  createdAt: string;
}

function usePendingVerifications() {
  return useQuery<{ verifications: PendingVerification[] }>({
    queryKey: ["admin", "pending-verifications"],
    queryFn: async () => {
      const token = getToken();
      const res = await fetch(`${import.meta.env.BASE_URL}api/admin/pending-verifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    refetchInterval: 15000,
  });
}

export default function AdminVerifications() {
  const { data, isLoading, refetch, isFetching } = usePendingVerifications();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (v: PendingVerification) => {
    navigator.clipboard.writeText(v.code);
    setCopiedId(v.id);
    toast({ title: "Copied", description: `Code ${v.code} copied for ${v.email}` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatExpiry = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin <= 0) return "Expired";
    if (diffMin < 60) return `${diffMin}m remaining`;
    return `${Math.floor(diffMin / 60)}h ${diffMin % 60}m remaining`;
  };

  const isExpiringSoon = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    return diffMs < 5 * 60 * 1000;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15">
              <KeyRound className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Pending Verifications</h1>
              <p className="text-slate-500 text-sm">Active verification codes for users awaiting email</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2 border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 rounded-xl">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Info Banner */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
            <p className="text-orange-400 text-sm font-medium leading-relaxed">
              These codes are shown here because email delivery is unavailable (Resend sandbox mode). Once you verify a domain at resend.com/domains, codes will be sent by email instead and this list will stay empty.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="modern-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-900/10">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              {data?.verifications?.length ?? 0} pending code{data?.verifications?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-900/50">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Email</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Username</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Code</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Expires</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <Loader2 className="animate-spin h-6 w-6 mx-auto text-blue-400" />
                    </TableCell>
                  </TableRow>
                ) : data?.verifications?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                      No pending verifications — email delivery is working normally.
                    </TableCell>
                  </TableRow>
                ) : data?.verifications?.map((v) => (
                  <TableRow key={v.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <TableCell className="text-slate-400">{v.email}</TableCell>
                    <TableCell className="font-semibold text-white">{v.username}</TableCell>
                    <TableCell>
                      <span className="font-mono text-gradient-primary font-bold text-lg tracking-widest">{v.code}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isExpiringSoon(v.expiresAt) ? "destructive" : "secondary"} className={`font-mono text-xs font-semibold ${
                        isExpiringSoon(v.expiresAt) ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}>
                        {formatExpiry(v.expiresAt)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(v)}
                        className="gap-2 border-blue-500/15 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                      >
                        {copiedId === v.id ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedId === v.id ? "Copied!" : "Copy Code"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
