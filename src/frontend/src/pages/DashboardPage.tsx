import { useState, useMemo } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { MonthlyRecordEditor } from '@/components/dashboard/MonthlyRecordEditor';
import { CenterComparisonChart } from '@/components/dashboard/CenterComparisonChart';
import { useAllDashboards, useSaveDashboard, useDeleteDashboard } from '@/hooks/useMonthlyDashboards';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { MonthlyDashboard } from '@/backend';

export interface Coach {
  id: string;
  name: string;
  salary: number;
  center: string;
}

export interface DashboardData {
  month: number;
  year: number;
  revenue: number;
  target: number;
  coaches: Coach[];
  centerName: string;
}

export function DashboardPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
  );

  const { data: dashboards, isLoading, error } = useAllDashboards();
  const saveMutation = useSaveDashboard();
  const deleteMutation = useDeleteDashboard();

  // Parse selected month
  const [selectedYear, selectedMonthNum] = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return [year, month];
  }, [selectedMonth]);

  // Find current dashboard data
  const currentDashboard = useMemo(() => {
    if (!dashboards) return null;
    return dashboards.find(
      (d) => Number(d.year) === selectedYear && Number(d.month) === selectedMonthNum
    );
  }, [dashboards, selectedYear, selectedMonthNum]);

  // Local state for editing (includes coaches array and centerName)
  const [editData, setEditData] = useState<DashboardData>(() => ({
    month: selectedMonthNum,
    year: selectedYear,
    revenue: 0,
    target: 0,
    coaches: [],
    centerName: '',
  }));

  // Sync editData when dashboard or selected month changes
  useMemo(() => {
    if (currentDashboard) {
      // Map backend coaches to frontend Coach interface
      const mappedCoaches: Coach[] = currentDashboard.coaches.map((c, idx) => ({
        id: `coach-${idx}-${Date.now()}`,
        name: c.name,
        salary: c.salaries,
        center: c.center,
      }));

      setEditData({
        month: Number(currentDashboard.month),
        year: Number(currentDashboard.year),
        revenue: currentDashboard.revenue,
        target: currentDashboard.target,
        coaches: mappedCoaches,
        centerName: currentDashboard.centerName,
      });
    } else {
      setEditData({
        month: selectedMonthNum,
        year: selectedYear,
        revenue: 0,
        target: 0,
        coaches: [],
        centerName: '',
      });
    }
  }, [currentDashboard, selectedMonthNum, selectedYear]);

  const handleSave = async (data: DashboardData) => {
    // Map frontend Coach to backend Coach
    const backendCoaches = data.coaches.map((c) => ({
      name: c.name,
      salaries: c.salary,
      center: c.center,
    }));

    const dashboardRecord: MonthlyDashboard = {
      month: BigInt(data.month),
      year: BigInt(data.year),
      revenue: data.revenue,
      target: data.target,
      coaches: backendCoaches,
      centerName: data.centerName,
    };

    // Generate ID from year and month
    const id = BigInt(data.year * 100 + data.month);
    
    await saveMutation.mutateAsync({ id, dashboard: dashboardRecord });
    setEditData(data);
  };

  const handleDelete = async () => {
    if (!currentDashboard) return;
    const id = BigInt(Number(currentDashboard.year) * 100 + Number(currentDashboard.month));
    await deleteMutation.mutateAsync(id);
  };

  // Calculate metrics for display
  const displayMetrics = useMemo(() => {
    const totalCoachSalaries = editData.coaches.reduce((sum, coach) => sum + coach.salary, 0);
    const salaryOutputPercent = editData.revenue > 0 ? (totalCoachSalaries / editData.revenue) * 100 : 0;

    return {
      revenue: editData.revenue,
      target: editData.target,
      totalCoachSalaries,
      salaryOutputPercent,
    };
  }, [editData]);

  return (
    <div className="min-h-screen relative">
      {/* Background pattern */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none bg-repeat"
        style={{ backgroundImage: 'url(/assets/generated/court-pattern.dim_1600x900.png)' }}
      />
      
      <div className="relative z-10">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Month Selector */}
          <div className="mb-8">
            <MonthSelector value={selectedMonth} onChange={setSelectedMonth} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <Skeleton className="h-96" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load dashboard data. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Dashboard Content */}
          {!isLoading && !error && (
            <>
              {/* Center Info Card */}
              {editData.centerName && (
                <Card className="mb-6 bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-court-green/10">
                        <Building2 className="h-5 w-5 text-court-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{editData.centerName}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Center Comparison Chart */}
              {dashboards && dashboards.length > 0 && (
                <div className="mb-8">
                  <CenterComparisonChart
                    dashboards={dashboards}
                    selectedMonth={selectedMonthNum}
                    selectedYear={selectedYear}
                  />
                </div>
              )}

              {/* Metrics Cards */}
              <MetricsCards
                revenue={displayMetrics.revenue}
                target={displayMetrics.target}
                totalCoachSalaries={displayMetrics.totalCoachSalaries}
                salaryOutputPercent={displayMetrics.salaryOutputPercent}
              />

              {/* Editor */}
              <div className="mt-8">
                <MonthlyRecordEditor
                  data={editData}
                  onChange={setEditData}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  isSaving={saveMutation.isPending}
                  isDeleting={deleteMutation.isPending}
                  hasExistingRecord={!!currentDashboard}
                />
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-border/40 bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Shuttle Dashboard. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'shuttle-dashboard'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
