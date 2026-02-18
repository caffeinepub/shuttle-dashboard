import { Activity } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/badminton-mark.dim_512x512.png"
              alt="Shuttle Dashboard"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                Shuttle Dashboard
                <Activity className="h-5 w-5 text-court-green" />
              </h1>
              <p className="text-sm text-muted-foreground">
                Track your center's performance
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
