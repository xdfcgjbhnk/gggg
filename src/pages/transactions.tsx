import { useState } from "react";
import { Layout } from "@/components/layout";
import { useListTransactions, ListTransactionsType } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, TrendingUp, TrendingDown, ArrowUpDown, RefreshCw, Receipt } from "lucide-react";

export default function Transactions() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<ListTransactionsType | "all">("all");
  const limit = 10;

  const { data, isLoading } = useListTransactions({
    page,
    limit,
    ...(type !== "all" && { type: type as ListTransactionsType })
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center border border-blue-500/15">
              <Receipt className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Transactions</h1>
              <p className="text-slate-500 text-sm">History of your earnings and withdrawals</p>
            </div>
          </div>

          <Select value={type} onValueChange={(v) => { setType(v as ListTransactionsType | "all"); setPage(1); }}>
            <SelectTrigger className="w-[180px] input-modern rounded-xl h-10">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="earning">Earnings</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="adjustment">Adjustments</SelectItem>
              <SelectItem value="refund">Refunds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table Card */}
        <div className="modern-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-900/50">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Date</TableHead>
                  <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Type</TableHead>
                  <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Description</TableHead>
                  <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Amount (USDT)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-slate-800">
                      <TableCell><Skeleton className="h-4 w-24 bg-slate-800 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20 bg-slate-800 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48 bg-slate-800 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16 bg-slate-800 rounded" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto bg-slate-800 rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : data?.transactions?.length ? (
                  data.transactions.map((tx) => (
                    <TableRow key={tx.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                      <TableCell className="text-slate-400 whitespace-nowrap text-sm">
                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] font-semibold uppercase tracking-wider ${
                          tx.type === 'earning' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' :
                          tx.type === 'withdrawal' ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' :
                          tx.type === 'adjustment' ? 'text-purple-400 border-purple-500/20 bg-purple-500/10' :
                          'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                        }`}>
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-white text-sm">{tx.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="uppercase tracking-wider text-[10px] font-semibold bg-slate-800 text-slate-400 border-slate-700">{tx.status}</Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold text-sm ${parseFloat(tx.amount) > 0 ? 'text-gradient-primary' : 'text-white'}`}>
                        {parseFloat(tx.amount) > 0 ? '+' : ''}{tx.amount}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center text-slate-500">
                      No transactions found.
                    </TableCell>
                  </TableRow>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-slate-800 text-slate-400 hover:text-white hover:border-blue-500/30 rounded-lg"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * limit >= data.total}
                  className="border-slate-800 text-slate-400 hover:text-white hover:border-blue-500/30 rounded-lg"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
