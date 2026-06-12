import { useState } from "react";
import { AdminLayout as Layout } from "@/components/admin-layout";
import { useListAllPlatforms, useCreatePlatform, useUpdatePlatform, useDeletePlatform, getListAllPlatformsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Copy, Check, Trash2, Link2, Globe, Star, ChevronDown, ChevronUp, Gamepad2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = window.location.origin;

function PostbackUrl({ platformId, secretKey }: { platformId: number; secretKey?: string }) {
  const [copied, setCopied] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);

  const standardUrl = `${BASE_URL}/api/postback/${platformId}?user_id={USER_ID}&amount={AMOUNT}&txid={TXN_ID}&secret={YOUR_SECRET}`;
  const fileUrl = `${BASE_URL}/file?status={status}&trans_id={trans_id}&user_id={user_id}&sub_id={subid}&sub_id_2={subid_2}&amount_local={amount_local}&amount_usd={amount_usd}&offer_id={offer_ID}&hash={secure_hash}&ip_click={ip_click}`;

  const copy = (url: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(url);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <code className="text-xs font-mono text-blue-400 truncate max-w-[190px]">{standardUrl.slice(0, 36)}…</code>
        <button onClick={() => copy(standardUrl, setCopied)} className="shrink-0 text-slate-500 hover:text-blue-400 transition-colors" title="Copy standard postback URL">
          {copied ? <Check className="h-3.5 w-3.5 text-blue-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      {secretKey && (
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1 py-0.5 rounded shrink-0">CPX</span>
          <code className="text-xs font-mono text-cyan-400 truncate max-w-[170px]">{fileUrl.slice(0, 32)}…</code>
          <button onClick={() => copy(fileUrl, setCopiedFile)} className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors" title="Copy CPX Research / fixed-path postback URL">
            {copiedFile ? <Check className="h-3.5 w-3.5 text-cyan-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminPlatforms() {
  const { data, isLoading } = useListAllPlatforms();
  const queryClient = useQueryClient();
  const updatePlatform = useUpdatePlatform();
  const deletePlatform = useDeletePlatform();
  const { toast } = useToast();

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete platform "${name}"?`)) return;
    deletePlatform.mutate({ platformId: id }, {
      onSuccess: () => {
        toast({ title: "Platform deleted" });
        queryClient.invalidateQueries({ queryKey: getListAllPlatformsQueryKey() });
      },
      onError: () => toast({ variant: "destructive", title: "Failed to delete" }),
    });
  };

  const handleSetFeatured = (id: number, name: string, currentPlacement: string) => {
    const newPlacement = currentPlacement === "homepage" ? "dedicated" : "homepage";
    updatePlatform.mutate(
      { platformId: id, data: { placement: newPlacement as any } },
      {
        onSuccess: () => {
          toast({ title: newPlacement === "homepage" ? `"${name}" is now featured on the landing page!` : `"${name}" removed from landing page` });
          queryClient.invalidateQueries({ queryKey: getListAllPlatformsQueryKey() });
        },
        onError: () => toast({ variant: "destructive", title: "Failed to update placement" }),
      }
    );
  };

  const featuredPlatform = data?.platforms?.find((p: any) => p.placement === "homepage");

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 flex items-center justify-center border border-purple-500/15">
              <Gamepad2 className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Offerwalls</h1>
              <p className="text-slate-500 text-sm">Manage offerwall platforms and postback settings</p>
            </div>
          </div>
          <PlatformDialog />
        </div>

        {/* Featured platform info */}
        <div className={`rounded-xl p-4 flex items-start gap-3 ${featuredPlatform ? "bg-cyan-500/5 border border-cyan-500/20" : "modern-card"}`}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${featuredPlatform ? "bg-cyan-500/15 border border-cyan-500/25" : "bg-slate-800 border border-slate-700"}`}>
            <Globe className={`h-4 w-4 ${featuredPlatform ? "text-cyan-400" : "text-slate-500"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm ${featuredPlatform ? "text-gradient-accent" : "text-white"}`}>
              {featuredPlatform ? `Featured on Landing Page: "${featuredPlatform.name}"` : "No Platform Featured on Landing Page"}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {featuredPlatform
                ? "This platform appears in an iframe on the landing page. Click the star icon to change or remove it."
                : "Click the star icon next to any platform to feature it on the landing page inside an iframe for visitors."}
            </p>
          </div>
        </div>

        {/* Postback info */}
        <div className="modern-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="h-4 w-4 text-blue-400" />
            <h4 className="font-semibold text-white text-sm">How Automatic Crediting Works</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Each platform has a unique <span className="text-blue-400 font-mono font-semibold">Postback URL</span>. Paste it in the offerwall's dashboard. When a user completes an offer, the offerwall calls this URL and the user's balance is credited automatically.
          </p>
        </div>

        {/* Table */}
        <div className="modern-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-900/50">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Name</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Postback URL</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Offer URL</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider text-center">Featured</TableHead>
                  <TableHead className="text-slate-500 font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="animate-spin h-6 w-6 mx-auto text-blue-400" /></TableCell></TableRow>
                ) : data?.platforms?.map((p: any) => {
                  const isFeatured = p.placement === "homepage";
                  const hasCustomParams = p.paramUserId || p.paramAmount || p.paramTxid || p.paramStatus;
                  return (
                    <TableRow key={p.id} className={`border-slate-800 transition-colors ${isFeatured ? "bg-cyan-500/5 hover:bg-cyan-500/10" : "hover:bg-slate-800/30"}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {p.logoUrl && <img src={p.logoUrl} alt={p.name} className="w-6 h-6 rounded object-cover border border-slate-700" />}
                          <div>
                            <span className="font-semibold text-white">{p.name}</span>
                            {isFeatured && (
                              <span className="ml-1.5 text-[10px] bg-cyan-500 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Featured</span>
                            )}
                            {hasCustomParams && (
                              <span className="ml-1 text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Custom</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <PostbackUrl platformId={p.id} secretKey={p.secretKey} />
                      </TableCell>
                      <TableCell>
                        {p.apiEndpoint ? (
                          <span className="text-xs font-mono text-slate-500 truncate block max-w-[130px]">
                            {p.apiEndpoint.slice(0, 28)}{p.apiEndpoint.length > 28 ? "…" : ""}
                          </span>
                        ) : <span className="text-slate-500 text-sm">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.isEnabled ? 'default' : 'secondary'} className={`text-[10px] font-semibold uppercase tracking-wider ${p.isEnabled ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                          {p.isEnabled ? 'Active' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => handleSetFeatured(p.id, p.name, p.placement)}
                          disabled={updatePlatform.isPending}
                          title={isFeatured ? "Remove from landing page" : "Set as featured on landing page"}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all duration-200 ${
                            isFeatured
                              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                              : "bg-slate-800 text-slate-500 hover:bg-cyan-500/15 hover:text-cyan-400"
                          }`}
                        >
                          <Star className={`h-4 w-4 ${isFeatured ? "fill-white" : ""}`} />
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <PlatformDialog platform={p} />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-500/10 hover:text-red-400 h-8 w-8 p-0 rounded-lg"
                            onClick={() => handleDelete(p.id, p.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {(!data?.platforms || data.platforms.length === 0) && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                      No platforms yet. Add your first offerwall above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function PlatformDialog({ platform }: { platform?: any }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createPlatform = useCreatePlatform();
  const updatePlatform = useUpdatePlatform();
  const [open, setOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [name, setName] = useState(platform?.name || "");
  const [description, setDescription] = useState(platform?.description || "");
  const [logoUrl, setLogoUrl] = useState(platform?.logoUrl || "");
  const [apiEndpoint, setApiEndpoint] = useState(platform?.apiEndpoint || "");
  const [secretKey, setSecretKey] = useState(platform?.secretKey || "");
  const [placement, setPlacement] = useState<any>(platform?.placement || "dedicated");
  const [isEnabled, setIsEnabled] = useState(platform?.isEnabled ?? true);
  const [paramUserId, setParamUserId] = useState(platform?.paramUserId || "");
  const [paramAmount, setParamAmount] = useState(platform?.paramAmount || "");
  const [paramTxid, setParamTxid] = useState(platform?.paramTxid || "");
  const [paramStatus, setParamStatus] = useState(platform?.paramStatus || "");

  const handleSave = () => {
    const payload: any = {
      name, description, logoUrl, apiEndpoint, secretKey, placement, isEnabled,
      paramUserId: paramUserId.trim() || undefined,
      paramAmount: paramAmount.trim() || undefined,
      paramTxid:   paramTxid.trim()   || undefined,
      paramStatus: paramStatus.trim() || undefined,
    };
    const mutation = platform
      ? updatePlatform.mutateAsync({ platformId: platform.id, data: payload })
      : createPlatform.mutateAsync({ data: payload });

    mutation.then(() => {
      toast({ title: platform ? "Platform updated" : "Platform created" });
      queryClient.invalidateQueries({ queryKey: getListAllPlatformsQueryKey() });
      setOpen(false);
    }).catch(err => {
      toast({ variant: "destructive", title: "Error", description: err.data?.error || "Failed" });
    });
  };

  const isPending = createPlatform.isPending || updatePlatform.isPending;
  const hasCustomParams = paramUserId || paramAmount || paramTxid || paramStatus;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {platform ? (
          <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-700 hover:border-blue-500/40 hover:text-blue-400 text-xs">Edit</Button>
        ) : (
          <Button className="btn-primary rounded-xl">
            <Plus className="mr-2 h-4 w-4" /> Add Offerwall
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="modern-card rounded-2xl max-w-md max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{platform ? 'Edit Offerwall' : 'Add Offerwall'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Platform Name *</Label>
            <Input placeholder="e.g. CPX Research" value={name} onChange={e => setName(e.target.value)} className="h-11 input-modern rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Description</Label>
            <Input placeholder="Short description" value={description} onChange={e => setDescription(e.target.value)} className="h-11 input-modern rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Offer Wall URL</Label>
            <Input placeholder="https://example.com/wall?uid={USER_ID}" value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)} className="h-11 input-modern rounded-xl font-mono text-sm" />
            <p className="text-xs text-slate-500">Use <code className="text-blue-400">{"{USER_ID}"}</code> as placeholder</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Secret Key</Label>
            <Input placeholder="Secret key from offerwall dashboard" value={secretKey} onChange={e => setSecretKey(e.target.value)} className="h-11 input-modern rounded-xl font-mono text-sm" />
          </div>
          {platform && (
            <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-3 space-y-1.5">
              <Label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Postback URL</Label>
              <PostbackUrl platformId={platform.id} secretKey={secretKey} />
              <p className="text-xs text-slate-500">Paste this in the offerwall's settings</p>
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Logo URL</Label>
            <Input placeholder="https://..." value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="h-11 input-modern rounded-xl font-mono text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Placement</Label>
            <select className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white input-modern" value={placement} onChange={e => setPlacement(e.target.value)}>
              <option value="dedicated">Dedicated Page</option>
              <option value="homepage">Featured on Homepage</option>
              <option value="sidebar">Sidebar</option>
            </select>
          </div>
          <div className="flex items-center gap-3 py-1">
            <Switch id="enabled" checked={isEnabled} onCheckedChange={setIsEnabled} />
            <Label htmlFor="enabled" className="cursor-pointer text-slate-300">{isEnabled ? "Platform is Active" : "Platform is Disabled"}</Label>
          </div>

          {/* Advanced: Custom Postback Param Names */}
          <div className="border border-slate-700 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Custom Postback Params</span>
                {hasCustomParams && (
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Set</span>
                )}
              </div>
              {showAdvanced ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
            </button>
            {showAdvanced && (
              <div className="p-4 space-y-3 border-t border-slate-700 bg-slate-900">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-500">User ID param</Label>
                    <Input placeholder="user_id" value={paramUserId} onChange={e => setParamUserId(e.target.value)} className="font-mono text-xs h-9 bg-slate-800 border-slate-700 rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-500">Amount param</Label>
                    <Input placeholder="amount" value={paramAmount} onChange={e => setParamAmount(e.target.value)} className="font-mono text-xs h-9 bg-slate-800 border-slate-700 rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-500">TX ID param</Label>
                    <Input placeholder="txid" value={paramTxid} onChange={e => setParamTxid(e.target.value)} className="font-mono text-xs h-9 bg-slate-800 border-slate-700 rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-500">Status param</Label>
                    <Input placeholder="status" value={paramStatus} onChange={e => setParamStatus(e.target.value)} className="font-mono text-xs h-9 bg-slate-800 border-slate-700 rounded-lg" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button onClick={handleSave} disabled={isPending || !name} className="w-full h-12 btn-primary rounded-xl font-semibold">
            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : (platform ? "Save Changes" : "Create Platform")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
