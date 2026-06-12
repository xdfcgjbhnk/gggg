import { Layout } from "@/components/layout";
import { useListPlatforms, useGetMe } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, ExternalLink, ChevronLeft, ChevronRight, Gamepad2, MonitorPlay } from "lucide-react";
import { useState, useEffect, useRef } from "react";

function buildOfferUrl(template: string, userId: number): string {
  return template
    .replace(/\{USER_ID\}/g, String(userId))
    .replace(/\[USER_ID\]/g, String(userId))
    .replace(/%7BUSER_ID%7D/g, String(userId));
}

export default function Platforms() {
  const { data: platformsData, isLoading: loadingPlatforms } = useListPlatforms();
  const { data: user } = useGetMe();
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const platforms = platformsData?.platforms ?? [];

  useEffect(() => {
    if (!platforms.length || selectedPlatform) return;
    const featured = platforms.find((p: any) => p.placement === "homepage" && p.apiEndpoint && p.isEnabled);
    if (featured) { setSelectedPlatform(featured); return; }
    const fallback = platforms.find((p: any) => p.apiEndpoint && p.isEnabled);
    if (fallback) setSelectedPlatform(fallback);
  }, [platforms]);

  const getOfferUrl = (platform: any) => {
    if (!platform?.apiEndpoint || !user?.id) return platform?.apiEndpoint;
    return buildOfferUrl(platform.apiEndpoint, user.id);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const enabledPlatforms = platforms.filter((p: any) => p.apiEndpoint && p.isEnabled);

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 flex items-center justify-center border border-cyan-500/15">
            <MonitorPlay className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-0.5 sm:mb-1">Offerwalls</h1>
            <p className="text-slate-500 text-sm sm:text-base">Select a platform to start earning USDT</p>
          </div>
        </div>

        {/* Horizontal Platform Selector */}
        <div className="relative">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-900/90 border border-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Platform Cards - Horizontal Scroll */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loadingPlatforms ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-32 sm:h-28 sm:w-40 shrink-0 rounded-xl bg-slate-800" />
              ))
            ) : enabledPlatforms.length === 0 ? (
              <div className="w-full text-center py-8 modern-card rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center mx-auto mb-3 border border-blue-500/15">
                  <Gamepad2 className="h-7 w-7 text-blue-400" />
                </div>
                <p className="font-semibold text-white mb-1">No platforms yet</p>
                <p className="text-slate-500 text-sm">Check back soon!</p>
              </div>
            ) : (
              enabledPlatforms.map((platform: any) => {
                const isSelected = selectedPlatform?.id === platform.id;
                const isFeatured = platform.placement === "homepage";

                return (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`shrink-0 w-32 sm:w-40 h-24 sm:h-28 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 p-3 group ${
                      isSelected
                        ? "modern-card-accent border-cyan-500/40"
                        : "modern-card hover:border-blue-500/30 cursor-pointer"
                    }`}
                  >
                    {platform.logoUrl ? (
                      <img
                        src={platform.logoUrl}
                        alt={platform.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-slate-700"
                      />
                    ) : (
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border ${
                        isSelected ? "bg-gradient-to-br from-cyan-500/25 to-teal-500/15 border-cyan-500/20" : "bg-slate-800 border-slate-700"
                      }`}>
                        <Zap className={`h-5 w-5 sm:h-6 sm:w-6 ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
                      </div>
                    )}
                    <div className="text-center w-full">
                      <p className={`text-xs sm:text-sm font-semibold truncate ${isSelected ? "text-gradient-accent" : "text-white"}`}>
                        {platform.name}
                      </p>
                      {isFeatured && (
                        <span className="text-[8px] sm:text-[9px] bg-cyan-500 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-900/90 border border-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Iframe Panel - Taller */}
        <div className="modern-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: "450px" }}>
          {selectedPlatform ? (
            <>
              {/* Top bar */}
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b border-blue-900/10 bg-slate-950/50 shrink-0">
                <div className="relative">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" />
                  <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 animate-ping opacity-50" />
                </div>
                {selectedPlatform.logoUrl ? (
                  <img src={selectedPlatform.logoUrl} alt={selectedPlatform.name} className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover border border-slate-700" />
                ) : (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/10 flex items-center justify-center border border-cyan-500/15">
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                  </div>
                )}
                <span className="font-semibold text-white flex-1 text-sm sm:text-base">{selectedPlatform.name}</span>
                <a
                  href={getOfferUrl(selectedPlatform)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
                </a>
              </div>

              <iframe
                key={selectedPlatform.id}
                src={getOfferUrl(selectedPlatform)}
                className="flex-1 w-full border-0"
                allow="fullscreen"
                title={selectedPlatform.name}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center mb-4 sm:mb-6 border border-blue-500/15">
                <Gamepad2 className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">No Platform Selected</h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-xs sm:max-w-sm">
                Select a platform from above to start earning USDT rewards.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </Layout>
  );
}
