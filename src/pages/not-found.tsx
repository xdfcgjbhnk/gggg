import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle, Coins, ArrowLeft } from "lucide-react";

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

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="relative z-10 text-center space-y-8">
        {/* Logo */}
        <Link href="/">
          <GamerewardsLogo />
        </Link>

        {/* Icon */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center mx-auto border border-blue-500/15">
          <AlertCircle className="h-12 w-12 text-blue-400" />
        </div>

        {/* Content */}
        <div>
          <h1 className="text-8xl font-extrabold text-gradient-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-3">Page Not Found</h2>
          <p className="text-slate-500 text-lg max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="h-12 btn-primary rounded-xl font-semibold px-8">
              <Home className="h-4 w-4 mr-2" />Back to Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="h-12 rounded-xl font-semibold border-blue-500/15 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 px-8">
              <ArrowLeft className="h-4 w-4 mr-2" />Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
